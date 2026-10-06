import { Proverb } from '../types';

const API_BASE = '/api';

export const apiService = {
  async healthCheck() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async syncState(state: any) {
    const res = await fetch(`${API_BASE}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
    return res.json();
  },

  async getProverbs(): Promise<{ success: boolean; proverbs: Proverb[] }> {
    const res = await fetch(`${API_BASE}/proverbs`);
    return res.json();
  },

  async getProverbById(id: string): Promise<{ success: boolean; proverb: Proverb }> {
    const res = await fetch(`${API_BASE}/proverbs/${id}`);
    return res.json();
  },

  async addProverb(proverb: Partial<Proverb>) {
    const res = await fetch(`${API_BASE}/proverbs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proverb),
    });
    return res.json();
  },

  async requestConsentCode(code?: string) {
    const res = await fetch(`${API_BASE}/consent/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return res.json();
  },

  async verifyConsentCode(code: string) {
    const res = await fetch(`${API_BASE}/consent/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return res.json();
  },

  async requestTeacher(data: { learnerName: string; guardianName: string; language: string; level: string; notes: string }) {
    const res = await fetch(`${API_BASE}/connections/teachers/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async askAiAssistant(prompt: string, language: string) {
    const res = await fetch(`${API_BASE}/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language }),
    });
    return res.json();
  }
};
