import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { execute, query } from '../db';

function mapUser(row: any): any {
  const user: any = { _id: row.id, name: row.name, email: row.email, password: row.password, passwordResetToken: row.password_reset_token, passwordResetExpires: row.password_reset_expires, createdAt: row.created_at, updatedAt: row.updated_at };
  user.comparePassword = (password: string) => bcrypt.compare(password, user.password);
  user.createPasswordResetToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return token;
  };
  user.save = async () => {
    if (user.password && !user.password.startsWith('$2')) user.password = await bcrypt.hash(user.password, 10);
    await execute('UPDATE users SET name = ?, email = ?, password = ?, password_reset_token = ?, password_reset_expires = ? WHERE id = ?', [user.name, user.email, user.password, user.passwordResetToken || null, user.passwordResetExpires || null, user._id]);
    return user;
  };
  return user;
}

export class User {
  static async findOne(filter: any) {
    let sql = 'SELECT * FROM users WHERE 1=1';
    const values: unknown[] = [];
    if (filter.email !== undefined) { sql += ' AND email = ?'; values.push(String(filter.email).toLowerCase()); }
    if (filter.passwordResetToken !== undefined) { sql += ' AND password_reset_token = ?'; values.push(filter.passwordResetToken); }
    if (filter.passwordResetExpires?.$gt !== undefined) { sql += ' AND password_reset_expires > ?'; values.push(new Date(filter.passwordResetExpires.$gt)); }
    const rows = await query<any[]>(`${sql} LIMIT 1`, values);
    return rows[0] ? mapUser(rows[0]) : null;
  }

  static async findById(id: string) {
    const rows = await query<any[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] ? mapUser(rows[0]) : null;
  }

  static async create(data: { name: string; email: string; password: string }) {
    const id = crypto.randomUUID();
    const password = await bcrypt.hash(data.password, 10);
    await execute('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)', [id, data.name, data.email.toLowerCase(), password]);
    return this.findById(id);
  }
}
