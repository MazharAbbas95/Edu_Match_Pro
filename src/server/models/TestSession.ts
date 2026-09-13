import crypto from 'crypto';
import { execute, query } from '../db';

async function mapSession(row: any) {
  const history = await query<any[]>('SELECT question_id, user_answer, is_correct, difficulty FROM test_session_history WHERE session_id = ? ORDER BY id', [row.id]);
  return { _id: row.id, user: row.user_id, currentDifficulty: row.current_difficulty, questionsAnswered: row.questions_answered, correctAnswers: row.correct_answers, history: history.map(item => ({ questionId: item.question_id, userAnswer: item.user_answer, isCorrect: Boolean(item.is_correct), difficulty: item.difficulty })), isCompleted: Boolean(row.is_completed), startedAt: row.started_at };
}

export class TestSession {
  static async updateMany(filter: any, update: any) { await execute('UPDATE test_sessions SET is_completed = ? WHERE user_id = ? AND is_completed = ?', [update.isCompleted, filter.user, filter.isCompleted]); }
  static async create(data: any) { const id = crypto.randomUUID(); await execute('INSERT INTO test_sessions (id, user_id, current_difficulty, questions_answered, correct_answers) VALUES (?, ?, ?, ?, ?)', [id, data.user, data.currentDifficulty || 'medium', data.questionsAnswered || 0, data.correctAnswers || 0]); return this.findById(id); }
  static async findOne(filter: any) { const rows = await query<any[]>('SELECT * FROM test_sessions WHERE id = ? AND user_id = ? AND is_completed = ? LIMIT 1', [filter._id, filter.user, filter.isCompleted]); return rows[0] ? new SessionDocument(await mapSession(rows[0])) : null; }
  private static async findById(id: string) { const rows = await query<any[]>('SELECT * FROM test_sessions WHERE id = ?', [id]); return rows[0] ? new SessionDocument(await mapSession(rows[0])) : null; }
}

class SessionDocument {
  [key: string]: any;
  constructor(data: any) { Object.assign(this, data); }
  async save() { await execute('UPDATE test_sessions SET current_difficulty = ?, questions_answered = ?, correct_answers = ?, is_completed = ? WHERE id = ?', [this.currentDifficulty, this.questionsAnswered, this.correctAnswers, this.isCompleted, this._id]); await execute('DELETE FROM test_session_history WHERE session_id = ?', [this._id]); for (const item of this.history) await execute('INSERT INTO test_session_history (session_id, question_id, user_answer, is_correct, difficulty) VALUES (?, ?, ?, ?, ?)', [this._id, item.questionId, item.userAnswer, item.isCorrect, item.difficulty]); return this; }
}
