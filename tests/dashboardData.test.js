import assert from 'node:assert/strict';
import test from 'node:test';
import { buildLearnerAnalytics } from '../src/server/dashboardData.js';

test('learner analytics aggregates only approved learner activity and omits submissions', () => {
  const result = buildLearnerAnalytics({
    learners: [
      { id: 'learner-1', name: 'Ayo', points: 45, streak: 3, created_at: '2026-10-18T08:00:00Z' },
      { id: 'learner-2', name: 'Tomi', points: 0, streak: 0, created_at: '2026-10-17T08:00:00Z' },
    ],
    progress: [
      { user_id: 'learner-1', lesson_type: 'voice', lesson_id: 'greetings', completed_at: '2026-10-18T09:00:00Z' },
      { user_id: 'learner-1', lesson_type: 'coding', lesson_id: 'sequence', completed_at: '2026-10-18T10:00:00Z' },
      { user_id: 'unlinked-learner', lesson_type: 'lesson', lesson_id: 'private', completed_at: '2026-10-18T11:00:00Z' },
    ],
    codeSubmissions: [
      { user_id: 'learner-1', created_at: '2026-10-18T10:00:00Z' },
      { user_id: 'learner-1', created_at: '2026-10-18T10:01:00Z' },
    ],
    voiceSubmissions: [
      { user_id: 'learner-1', audio_score: 80 },
      { user_id: 'learner-1', audio_score: 92 },
      { user_id: 'learner-2', audio_score: null },
    ],
  });

  assert.equal(result.length, 2);
  assert.deepEqual(result[0], {
    id: 'learner-1',
    name: 'Ayo',
    points: 45,
    streak: 3,
    joinedAt: '2026-10-18T08:00:00Z',
    completedLessons: 2,
    codingSessions: 2,
    voicePractices: 2,
    averageVoiceScore: 86,
    recentActivity: [
      { lessonType: 'voice', lessonId: 'greetings', completedAt: '2026-10-18T09:00:00Z' },
      { lessonType: 'coding', lessonId: 'sequence', completedAt: '2026-10-18T10:00:00Z' },
    ],
  });
  assert.equal(result[1].averageVoiceScore, null);
  assert.equal('email' in result[0], false);
  assert.equal('code' in result[0], false);
});
