import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Ensure users.json exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

export class UserLocal {
  static async findOne(query: any) {
    const users = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const user = users.find((u: any) => {
      for (let key in query) {
        if (u[key] !== query[key]) return false;
      }
      return true;
    });
    
    if (user) {
      // Add methods to the found user object
      user.comparePassword = async function(password: string) {
        return await bcrypt.compare(password, this.password);
      };
      user.createPasswordResetToken = function() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        return resetToken;
      };
      user.save = async function() {
        return await UserLocal.update(this);
      };
    }
    return user;
  }

  static async create(userData: any) {
    const users = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    
    // Hash password
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
    
    // Add methods to the new user object
    (newUser as any).save = async function() {
      return await UserLocal.update(this);
    };
    
    return newUser;
  }

  static async update(updatedUser: any) {
    let users = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    users = users.map((u: any) => (u._id === updatedUser._id ? updatedUser : u));
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
    return updatedUser;
  }
}
