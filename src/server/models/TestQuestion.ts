import crypto from 'crypto';
import { execute, query } from '../db';

async function mapQuestion(row: any) {
  const options = await query<any[]>('SELECT option_text FROM test_question_options WHERE question_id = ? ORDER BY option_index', [row.id]);
  return { _id: row.id, subject: row.subject, difficulty: row.difficulty, text: row.text, options: options.map(option => option.option_text), correctIndex: row.correct_index, explanation: row.explanation, createdAt: row.created_at };
}

export class TestQuestion {
  static async findById(id: string) { const rows = await query<any[]>('SELECT * FROM test_questions WHERE id = ?', [id]); return rows[0] ? mapQuestion(rows[0]) : null; }
  static async findRandom(difficulty: string, excludedIds: string[]) {
    const placeholders = excludedIds.map(() => '?').join(', ');
    const exclusion = excludedIds.length ? ` AND q.id NOT IN (${placeholders})` : '';
    const difficultyFilter = difficulty === 'any' ? '' : ' AND q.difficulty = ?';
    const rows = await query<any[]>(`SELECT q.* FROM test_questions q WHERE 1=1${difficultyFilter}${exclusion} ORDER BY RAND() LIMIT 1`, difficulty === 'any' ? excludedIds : [difficulty, ...excludedIds]);
    return rows[0] ? mapQuestion(rows[0]) : null;
  }
  static async insertMany(questions: any[], _options?: any) {
    for (const question of questions) {
      const id = crypto.randomUUID();
      await execute('INSERT INTO test_questions (id, subject, difficulty, text, correct_index, explanation) VALUES (?, ?, ?, ?, ?, ?)', [id, question.subject, question.difficulty, question.text, question.correctIndex, question.explanation || null]);
      for (let index = 0; index < question.options.length; index++) await execute('INSERT INTO test_question_options (question_id, option_index, option_text) VALUES (?, ?, ?)', [id, index, question.options[index]]);
    }
  }
}
