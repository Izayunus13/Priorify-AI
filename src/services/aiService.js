function getActiveTasks(priorityTasks) {
  return priorityTasks.filter((task) => task.status !== "Selesai");
}

function getTopTask(priorityTasks) {
  const activeTasks = getActiveTasks(priorityTasks);
  return activeTasks.length > 0 ? activeTasks[0] : null;
}

function getUrgencyReason(task) {
  if (!task) return "";

  if (task.daysLeft < 0) {
    return "tugas ini sudah melewati deadline sehingga perlu segera ditangani.";
  }

  if (task.daysLeft === 0) {
    return "deadline tugas ini adalah hari ini sehingga perlu menjadi fokus utama.";
  }

  if (task.daysLeft <= 3) {
    return "deadline tugas ini sudah dekat sehingga sebaiknya dikerjakan lebih awal.";
  }

  if (task.daysLeft <= 7) {
    return "deadline tugas ini masih dalam waktu menengah, tetapi tetap perlu dicicil agar tidak menumpuk.";
  }

  return "deadline tugas ini masih cukup jauh, tetapi tetap perlu dijadwalkan agar pengerjaan lebih teratur.";
}

function getTaskBreakdown(task) {
  if (!task) {
    return "Belum ada tugas aktif yang perlu dipecah menjadi langkah kecil.";
  }

  return `Untuk tugas "${task.title}", kamu bisa membaginya menjadi beberapa langkah:
1. Baca ulang instruksi atau ketentuan tugas.
2. Tentukan bagian yang paling sulit atau paling penting.
3. Kumpulkan bahan, referensi, atau data yang dibutuhkan.
4. Kerjakan bagian utama terlebih dahulu.
5. Lengkapi bagian pendukung seperti format, catatan, atau lampiran.
6. Lakukan revisi dan final checking sebelum deadline.`;
}

export function getAIInsight(priorityTasks, generatedSchedule) {
  const activeTasks = getActiveTasks(priorityTasks);
  const topTask = getTopTask(priorityTasks);

  if (!topTask) {
    return "Semua tugas sudah selesai. Gunakan waktu kosong untuk review materi, merapikan catatan, atau mempersiapkan tugas berikutnya.";
  }

  const scheduleInfo =
    generatedSchedule.length > 0
      ? `Sistem juga sudah menyusun ${generatedSchedule.length} blok jadwal belajar berdasarkan waktu kosong yang tersedia.`
      : "Kamu belum memiliki jadwal otomatis. Masukkan waktu kosong agar sistem bisa menyusun rencana belajar.";

  const otherTaskInfo =
    activeTasks.length > 1
      ? `Setelah tugas utama selesai, lanjutkan ke ${activeTasks.length - 1} tugas aktif lainnya sesuai urutan prioritas.`
      : "Saat ini hanya ada satu tugas aktif yang perlu difokuskan.";

  return `Prioritas utama saat ini adalah "${topTask.title}" dari mata kuliah ${topTask.course}. ${getUrgencyReason(
    topTask
  )} Tugas ini diprioritaskan berdasarkan deadline, tingkat kesulitan, tingkat kepentingan, estimasi waktu pengerjaan, dan status tugas. ${scheduleInfo} ${otherTaskInfo}`;
}

export function getAssistantReply(question, priorityTasks, generatedSchedule) {
  const lowerQuestion = question.toLowerCase();
  const activeTasks = getActiveTasks(priorityTasks);
  const topTask = getTopTask(priorityTasks);

  if (lowerQuestion.includes("prioritas") || lowerQuestion.includes("dulu")) {
    if (!topTask) {
      return "Tidak ada tugas aktif saat ini. Semua tugas sudah selesai.";
    }

    return `Tugas yang paling perlu dikerjakan lebih dulu adalah "${topTask.title}" dari mata kuliah ${topTask.course}. Alasannya, ${getUrgencyReason(
      topTask
    )} Selain itu, tugas ini juga dipertimbangkan dari tingkat kesulitan, kepentingan, estimasi waktu, dan status pengerjaan.`;
  }

  if (lowerQuestion.includes("jadwal") || lowerQuestion.includes("belajar")) {
    if (generatedSchedule.length === 0) {
      return "Masukkan jadwal kosong terlebih dahulu agar aku bisa menyusun jadwal belajar otomatis berdasarkan tugas aktif yang kamu punya.";
    }

    const firstSchedule = generatedSchedule[0];

    return `Jadwal belajar sudah dibuat. Rekomendasi pertama adalah mengerjakan "${firstSchedule.task}" pada ${firstSchedule.day}, pukul ${firstSchedule.time}. Setelah itu, lanjutkan mengikuti urutan jadwal otomatis agar tugas tidak menumpuk mendekati deadline.`;
  }

  if (
    lowerQuestion.includes("pecah") ||
    lowerQuestion.includes("breakdown") ||
    lowerQuestion.includes("langkah") ||
    lowerQuestion.includes("bagi")
  ) {
    return getTaskBreakdown(topTask);
  }

  if (
    lowerQuestion.includes("deadline") ||
    lowerQuestion.includes("mepet") ||
    lowerQuestion.includes("urgent")
  ) {
    if (!topTask) {
      return "Tidak ada tugas aktif yang mendekati deadline.";
    }

    const urgentTasks = activeTasks.filter((task) => task.daysLeft <= 3);

    if (urgentTasks.length === 0) {
      return "Belum ada tugas yang sangat mepet. Namun, kamu tetap disarankan mencicil tugas dari sekarang agar tidak menumpuk.";
    }

    return `Ada ${urgentTasks.length} tugas yang termasuk mendesak. Yang paling perlu difokuskan adalah "${topTask.title}" karena ${getUrgencyReason(
      topTask
    )}`;
  }

  if (
    lowerQuestion.includes("selesai") ||
    lowerQuestion.includes("progress") ||
    lowerQuestion.includes("status")
  ) {
    const completedTasks = priorityTasks.filter(
      (task) => task.status === "Selesai"
    ).length;

    return `Saat ini terdapat ${completedTasks} tugas yang sudah selesai dan ${activeTasks.length} tugas yang masih aktif. Fokus berikutnya adalah menyelesaikan tugas aktif berdasarkan urutan prioritas.`;
  }

  if (
    lowerQuestion.includes("saran") ||
    lowerQuestion.includes("rekomendasi") ||
    lowerQuestion.includes("apa yang harus")
  ) {
    return getAIInsight(priorityTasks, generatedSchedule);
  }

  return `Aku bisa membantu menentukan prioritas tugas, menyusun jadwal belajar, memecah tugas besar menjadi langkah kecil, dan memberi rekomendasi pengerjaan. Coba tanyakan: "Tugas mana yang harus dikerjakan dulu?" atau "Buatkan jadwal belajar saya."`;
}