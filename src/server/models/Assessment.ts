import crypto from 'crypto';
import { execute, query } from '../db';

export class Assessment {
  static async create(data: any) {
    const id = crypto.randomUUID();
    await execute('INSERT INTO assessments (id, user_id, logic_score, verbal_score, discipline_score, creativity_score, top_trait) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, data.user, data.scores.logic, data.scores.verbal, data.scores.discipline, data.scores.creativity, data.topTrait]);
    for (const suggestion of data.suggestions) await execute('INSERT INTO assessment_suggestions (assessment_id, title, industry) VALUES (?, ?, ?)', [id, suggestion.title, suggestion.industry]);
    for (const trait of data.strengths) await execute("INSERT INTO assessment_traits (assessment_id, trait_type, trait) VALUES (?, 'strength', ?)", [id, trait]);
    for (const trait of data.weaknesses) await execute("INSERT INTO assessment_traits (assessment_id, trait_type, trait) VALUES (?, 'weakness', ?)", [id, trait]);
    return this.findById(id);
  }

  static async findOne(filter: { user: string }) {
    const rows = await query<any[]>('SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [filter.user]);
    return rows[0] ? this.findById(rows[0].id) : null;
  }

  private static async findById(id: string) {
    const rows = await query<any[]>('SELECT * FROM assessments WHERE id = ?', [id]);
    if (!rows[0]) return null;
    const suggestions = await query<any[]>('SELECT title, industry FROM assessment_suggestions WHERE assessment_id = ?', [id]);
    const traits = await query<any[]>('SELECT trait_type, trait FROM assessment_traits WHERE assessment_id = ?', [id]);
    return { _id: rows[0].id, user: rows[0].user_id, scores: { logic: Number(rows[0].logic_score), verbal: Number(rows[0].verbal_score), discipline: Number(rows[0].discipline_score), creativity: Number(rows[0].creativity_score) }, suggestions, strengths: traits.filter(t => t.trait_type === 'strength').map(t => t.trait), weaknesses: traits.filter(t => t.trait_type === 'weakness').map(t => t.trait), topTrait: rows[0].top_trait, createdAt: rows[0].created_at };
  }
}
