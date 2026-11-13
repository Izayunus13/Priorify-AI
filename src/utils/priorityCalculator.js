const difficultyPoint = {
  Mudah: 8,
  Sedang: 16,
  Sulit: 25,
};

const importancePoint = {
  Rendah: 8,
  Sedang: 18,
  Tinggi: 30,
};

export function getDaysLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUrgencyPoint(daysLeft) {
  if (daysLeft <= 0) return 45;
  if (daysLeft === 1) return 40;
  if (daysLeft <= 3) return 32;
  if (daysLeft <= 7) return 22;
  return 12;
}

export function getPriorityLabel(score) {
  if (score >= 80) return "Sangat Prioritas";
  if (score >= 60) return "Prioritas Tinggi";
  if (score >= 40) return "Prioritas Sedang";
  return "Prioritas Rendah";
}

export function calculateTaskPriority(task) {
  const daysLeft = getDaysLeft(task.deadline);
  const urgency = getUrgencyPoint(daysLeft);
  const difficulty = difficultyPoint[task.difficulty] || 0;
  const importance = importancePoint[task.importance] || 0;
  const estimate = Math.min(Number(task.estimate) * 4, 20);

  const statusPenalty =
    task.status === "Selesai"
      ? 100
      : task.status === "Sedang dikerjakan"
      ? 8
      : 0;

  const priorityScore = Math.max(
    0,
    urgency + difficulty + importance + estimate - statusPenalty
  );

  return {
    ...task,
    daysLeft,
    priorityScore,
    priorityLabel: getPriorityLabel(priorityScore),
  };
}

export function sortTasksByPriority(tasks) {
  return tasks.map(calculateTaskPriority).sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }

    return new Date(a.deadline) - new Date(b.deadline);
  });
}