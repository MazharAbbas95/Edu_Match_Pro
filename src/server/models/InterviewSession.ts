import crypto from 'crypto';
import { execute, query } from '../db';

async function mapSession(row: any) {
  const transcript = await query<any[]>('SELECT question, answer, feedback_score, feedback_strengths, feedback_improvements, timestamp FROM interview_transcript WHERE session_id = ? ORDER BY id', [row.id]);
  return { _id: row.id, user: row.user_id, type: row.type, status: row.status, transcript: transcript.map(item => ({ question: item.question, answer: item.answer, feedback: { score: item.feedback_score, strengths: item.feedback_strengths, improvements: item.feedback_improvements }, timestamp: item.timestamp })), createdAt: row.created_at };
}

export class InterviewSession {
  static async updateMany(filter: any, update: any) { await execute('UPDATE interview_sessions SET status = ? WHERE user_id = ? AND status = ?', [update.status, filter.user, filter.status]); }
  static async create(data: any) { const id = crypto.randomUUID(); await execute('INSERT INTO interview_sessions (id, user_id, type) VALUES (?, ?, ?)', [id, data.user, data.type]); return this.findById(id); }
  static async findOne(filter: any) { const rows = await query<any[]>('SELECT * FROM interview_sessions WHERE user_id = ? AND id = COALESCE(?, id) AND status = COALESCE(?, status) ORDER BY created_at DESC LIMIT 1', [filter.user, filter._id || null, filter.status || null]); return rows[0] ? this.document(rows[0]) : null; }
  private static async findById(id: string) { const rows = await query<any[]>('SELECT * FROM interview_sessions WHERE id = ?', [id]); return rows[0] ? this.document(rows[0]) : null; }
  private static async document(row: any) { return new SessionDocument(await mapSession(row)); }
}

class SessionDocument {
  [key: string]: any;
  constructor(data: any) { Object.assign(this, data); }
  async save() { await execute('UPDATE interview_sessions SET status = ? WHERE id = ?', [this.status, this._id]); await execute('DELETE FROM interview_transcript WHERE session_id = ?', [this._id]); for (const item of this.transcript) await execute('INSERT INTO interview_transcript (session_id, question, answer, feedback_score, feedback_strengths, feedback_improvements, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)', [this._id, item.question, item.answer, item.feedback?.score || null, item.feedback?.strengths || null, item.feedback?.improvements || null, item.timestamp || new Date()]); return this; }
}
