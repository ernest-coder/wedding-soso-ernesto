import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export interface LeaderboardEntry {
  id?: number;
  name: string;
  score: number;
  date: string; // ISO
}

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly KEY = 'dino_leaderboard_v1'; // fallback
  private readonly MAX = 10;

  private supabase: SupabaseClient | null = null;
  private useRemote = false;

  constructor() {
    if (environment.supabaseUrl && environment.supabaseAnonKey) {
      // initialize supabase
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
      this.useRemote = true;
    }
  }

  // ---- local fallback utilities ----
  private readLocal(): LeaderboardEntry[] {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as any[];
      return parsed.map(p => ({ name: p.name, score: p.score, date: p.date }));
    } catch {
      return [];
    }
  }

  private writeLocal(list: LeaderboardEntry[]) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(list));
    } catch {}
  }

  // ---- public API ----

  // returns top N entries (remote or local)
  async getTop(): Promise<LeaderboardEntry[]> {
    if (this.useRemote && this.supabase) {
      const { data, error } = await this.supabase
        .from('leaderboard')
        .select('id, name, score, created_at')
        .order('score', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(this.MAX);
      if (error) {
        console.warn('Supabase read error:', error);
        return this.readLocal();
      }
      return (data || []).map((r: any) => ({ id: r.id, name: r.name, score: r.score, date: r.created_at }));
    } else {
      return this.readLocal();
    }
  }

  // check if score qualifies (based on remote or local top list)
  async qualifies(score: number): Promise<boolean> {
    const top = await this.getTop();
    if (top.length < this.MAX) return true;
    return score > top[top.length - 1].score;
  }

  // add entry remotely or locally
  async addEntry(name: string, score: number): Promise<LeaderboardEntry[]> {
    const entryName = (name || 'Anonymous').slice(0, 32);
    const entryScore = Math.floor(score);
    if (this.useRemote && this.supabase) {
      const { data, error } = await this.supabase
        .from('leaderboard')
        .insert({ name: entryName, score: entryScore })
        .select('id, name, score, created_at')
        .limit(1);
      if (error) {
        console.warn('Supabase insert error:', error);
        // fallback to local
        return this.addLocal(entryName, entryScore);
      }
      // return latest top
      return this.getTop();
    } else {
      return this.addLocal(entryName, entryScore);
    }
  }

  // local-only entry and trimmed top
  private addLocal(name: string, score: number): LeaderboardEntry[] {
    const list = this.readLocal();
    const entry = { name: name || 'Anonymous', score, date: new Date().toISOString() };
    list.push(entry);
    list.sort((a, b) => b.score - a.score || (a.date < b.date ? -1 : 1));
    const sliced = list.slice(0, this.MAX);
    this.writeLocal(sliced);
    return sliced;
  }

  // optional: clear fallback local storage
  clearLocal() {
    try { localStorage.removeItem(this.KEY); } catch {}
  }
}
