export function loadData(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : fallback;
  } catch (error) {
    console.error("Gagal membaca data dari localStorage:", error);
    return fallback;
  }
}

export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Gagal menyimpan data ke localStorage:", error);
  }
}

export function clearStorageData() {
  localStorage.removeItem("priorify_tasks");
  localStorage.removeItem("priorify_slots");
}