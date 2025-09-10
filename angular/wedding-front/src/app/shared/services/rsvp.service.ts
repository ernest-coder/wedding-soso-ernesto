import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {

  private supabase: SupabaseClient | null = null;
  private useRemote = false;

  constructor() {
    if (environment.supabaseUrl && environment.supabaseAnonKey) {
      // initialize supabase
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
      this.useRemote = true;
    }
  }

  async submitRSVP(data: any) {
    if (!this.useRemote || !this.supabase) return new Error('Remote database not configured');
    const { error } = await this.supabase.from('rsvp').insert([data]);
    return error;
  }
}
