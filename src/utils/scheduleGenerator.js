const dayOrder = {
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
  Minggu: 7,
};

function timeToMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function minutesToTime(totalMinutes) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;

  const formattedHour = String(hour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");

  return `${formattedHour}:${formattedMinute}`;
}

function getDurationInHours(start, end) {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  return Math.max(0, (endMinutes - startMinutes) / 60);
}

function sortSlots(slots) {
  return [...slots].sort((a, b) => {
    const dayDifference = dayOrder[a.day] - dayOrder[b.day];

    if (dayDifference !== 0) {
      return dayDifference;
    }

    return timeToMinutes(a.start) - timeToMinutes(b.start);
  });
}

export function generateSchedule(priorityTasks, slots) {
  const activeTasks = priorityTasks
    .filter((task) => task.status !== "Selesai")
    .map((task) => ({
      ...task,
      remaining: Number(task.estimate),
    }));

  const sortedSlots = sortSlots(slots);
  const scheduleResult = [];
  let scheduleId = 1;

  sortedSlots.forEach((slot) => {
    let availableTime = getDurationInHours(slot.start, slot.end);
    let currentStartMinutes = timeToMinutes(slot.start);

    while (availableTime > 0 && activeTasks.some((task) => task.remaining > 0)) {
      const selectedTask = activeTasks.find((task) => task.remaining > 0);

      if (!selectedTask) break;

      const usedTime = Math.min(availableTime, selectedTask.remaining);
      const usedMinutes = usedTime * 60;

      const scheduleStart = minutesToTime(currentStartMinutes);
      const scheduleEnd = minutesToTime(currentStartMinutes + usedMinutes);

      scheduleResult.push({
        id: scheduleId,
        day: slot.day,
        time: `${scheduleStart} - ${scheduleEnd}`,
        task: selectedTask.title,
        course: selectedTask.course,
        duration: usedTime,
        reason:
          selectedTask.daysLeft <= 3
            ? "Deadline tugas sudah dekat, sehingga perlu dikerjakan lebih awal."
            : "Tugas ini tetap perlu dicicil agar tidak menumpuk menjelang deadline.",
      });

      selectedTask.remaining -= usedTime;
      availableTime -= usedTime;
      currentStartMinutes += usedMinutes;
      scheduleId += 1;
    }
  });

  return scheduleResult;
}