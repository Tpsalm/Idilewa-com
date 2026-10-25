function countByUser(rows, field) {
  return rows.reduce((counts, row) => {
    counts[row.user_id] = (counts[row.user_id] || 0) + (field ? Number(row[field] || 0) : 1);
    return counts;
  }, {});
}

function averageByUser(rows, field) {
  const totals = {};
  const counts = {};
  for (const row of rows) {
    if (row[field] === null || row[field] === undefined || row[field] === '') continue;
    const score = Number(row[field]);
    if (!Number.isFinite(score)) continue;
    totals[row.user_id] = (totals[row.user_id] || 0) + score;
    counts[row.user_id] = (counts[row.user_id] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(totals).map(([userId, total]) => [
    userId,
    Math.round(total / counts[userId]),
  ]));
}

export function buildLearnerAnalytics({ learners, progress, codeSubmissions, voiceSubmissions }) {
  const progressCounts = countByUser(progress);
  const codingCounts = countByUser(codeSubmissions);
  const voiceCounts = countByUser(voiceSubmissions);
  const voiceAverages = averageByUser(voiceSubmissions, 'audio_score');
  const recentByUser = {};

  for (const item of progress) {
    const recent = recentByUser[item.user_id] || [];
    if (recent.length < 4) {
      recent.push({
        lessonType: item.lesson_type,
        lessonId: item.lesson_id,
        completedAt: item.completed_at,
      });
      recentByUser[item.user_id] = recent;
    }
  }

  return learners.map((learner) => ({
    id: learner.id,
    name: learner.name || 'Learner',
    points: Number(learner.points) || 0,
    streak: Number(learner.streak) || 0,
    joinedAt: learner.created_at,
    completedLessons: progressCounts[learner.id] || 0,
    codingSessions: codingCounts[learner.id] || 0,
    voicePractices: voiceCounts[learner.id] || 0,
    averageVoiceScore: voiceAverages[learner.id] ?? null,
    recentActivity: recentByUser[learner.id] || [],
  }));
}
