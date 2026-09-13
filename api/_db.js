import mysql from "mysql2/promise";

let pool;

export function getPool() {
  if (!pool) {
    const connectionUrl = process.env.DATABASE_URL?.trim();
    const host = process.env.MYSQL_HOST?.trim();
    const user = process.env.MYSQL_USER?.trim();
    const database = process.env.MYSQL_DATABASE?.trim();

    if (!connectionUrl && (!host || !user || !database)) {
      throw new Error("Vercel MySQL is not configured. Set DATABASE_URL or MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE in Vercel Production Environment Variables.");
    }

    pool = mysql.createPool(connectionUrl || {
      host,
      port: Number(process.env.MYSQL_PORT || 3306),
      user,
      password: process.env.MYSQL_PASSWORD,
      database,
      waitForConnections: true,
      connectionLimit: 5,
      dateStrings: true,
    });
  }
  return pool;
}