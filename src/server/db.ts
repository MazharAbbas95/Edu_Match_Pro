import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'edu_match_pro',
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  dateStrings: true
  });

export async function query<T extends RowDataPacket[]>(sql: string, values: any[] = []) {
  const [rows] = await pool.query<T>(sql, values);
  return rows;
}

export async function execute(sql: string, values: any[] = []) {
  const [result] = await pool.execute<ResultSetHeader>(sql, values);
  return result;
}

export { pool };