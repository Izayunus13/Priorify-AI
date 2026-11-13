import { loginWithGoogle, logoutGoogle } from "./services/firebase";
import { useEffect, useMemo, useState } from "react";

import Navbar from "./components/Navbar";
import AmbientSky from "./components/AmbientSky";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Schedule from "./pages/Schedule";
import Assistant from "./pages/Assistant";
import Settings from "./pages/Settings";

import { initialTasks, initialSlots } from "./data/initialData";
import { loadData, saveData, clearStorageData } from "./utils/storage";
import { sortTasksByPriority } from "./utils/priorityCalculator";
import { generateSchedule } from "./utils/scheduleGenerator";
import { getAIInsight, getAssistantReply } from "./services/aiService";

function App() {
  const [page, setPage] = useState("landing");
  const [theme, setTheme] = useState(() => {
    const saved = loadData("priorify_theme", null);
    return saved === "light" || saved === "dark" ? saved : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });
  const [motion, setMotion] = useState(() => loadData("priorify_motion", true) !== false);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveData("priorify_theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#060a12" : "#ecf5fd");
  }, [theme]);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "full" : "reduced";
    saveData("priorify_motion", motion);
  }, [motion]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [page]);
  function openDemo(destination = "dashboard") { setIsLogin(true); setPage(destination); }
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  const [tasks, setTasks] = useState(() =>
    loadData("priorify_tasks", initialTasks)
  );

  const [slots, setSlots] = useState(() =>
    loadData("priorify_slots", initialSlots)
  );

  const [taskForm, setTaskForm] = useState({
    title: "",
    course: "",
    deadline: "",
    estimate: "",
    difficulty: "Sedang",
    importance: "Sedang",
    status: "Belum dikerjakan",
    notes: "",
  });

  const [slotForm, setSlotForm] = useState({
    day: "Senin",
    start: "",
    end: "",
    note: "",
  });

  const [chatInput, setChatInput] = useState("");

  const [chat, setChat] = useState([
    {
      role: "ai",
      text: "Halo! Aku Priorify AI. Aku bisa bantu menentukan prioritas tugas, membuat jadwal belajar, dan memecah tugas besar.",
    },
  ]);

  useEffect(() => {
    saveData("priorify_tasks", tasks);
  }, [tasks]);

  useEffect(() => {
    saveData("priorify_slots", slots);
  }, [slots]);

  const priorityTasks = useMemo(() => {
    return sortTasksByPriority(tasks);
  }, [tasks]);

  const generatedSchedule = useMemo(() => {
    return generateSchedule(priorityTasks, slots);
  }, [priorityTasks, slots]);

  const aiInsight = useMemo(() => {
    return getAIInsight(priorityTasks, generatedSchedule);
  }, [priorityTasks, generatedSchedule]);

  const completedTasks = tasks.filter((task) => task.status === "Selesai").length;
  const nearestTask = priorityTasks.find((task) => task.status !== "Selesai");

  function handleLogin(event) {
    event.preventDefault();
    setIsLogin(true);
    setPage("dashboard");
  }

  async function handleGoogleLogin() {
  try {
    const loggedInUser = await loginWithGoogle();

    setUser({
      name: loggedInUser.displayName,
      email: loggedInUser.email,
      photo: loggedInUser.photoURL,
    });

    setIsLogin(true);
    setPage("dashboard");
  } catch (error) {
    console.error("Google login gagal:", error);
    alert("Login Google gagal. Pastikan Google provider sudah aktif di Firebase.");
  }
}

async function handleLogout() {
  try {
    await logoutGoogle();
  } catch (error) {
    console.error("Logout Google gagal:", error);
  }

  setUser(null);
  setIsLogin(false);
  setPage("landing");
}

  function handleAddTask(event) {
    event.preventDefault();

    if (
      !taskForm.title ||
      !taskForm.course ||
      !taskForm.deadline ||
      !taskForm.estimate
    ) {
      alert("Isi nama tugas, mata kuliah, deadline, dan estimasi waktu terlebih dahulu.");
      return;
    }

    const newTask = {
      id: Date.now(),
      ...taskForm,
      estimate: Number(taskForm.estimate),
    };

    setTasks([newTask, ...tasks]);

    setTaskForm({
      title: "",
      course: "",
      deadline: "",
      estimate: "",
      difficulty: "Sedang",
      importance: "Sedang",
      status: "Belum dikerjakan",
      notes: "",
    });

    setPage("dashboard");
  }

  function handleAddSlot(event) {
    event.preventDefault();

    if (!slotForm.start || !slotForm.end) {
      alert("Isi jam mulai dan jam selesai terlebih dahulu.");
      return;
    }

    const newSlot = {
      id: Date.now(),
      ...slotForm,
    };

    setSlots([newSlot, ...slots]);

    setSlotForm({
      day: "Senin",
      start: "",
      end: "",
      note: "",
    });
  }

  function handleUpdateStatus(id, status) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
            }
          : task
      )
    );
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function handleDeleteSlot(id) {
    setSlots(slots.filter((slot) => slot.id !== id));
  }

  function handleResetData() {
    clearStorageData();
    setTasks(initialTasks);
    setSlots(initialSlots);
    alert("Data prototype berhasil direset.");
  }

  function handleChatSubmit(event) {
    event.preventDefault();

    if (!chatInput.trim()) return;

    const reply = getAssistantReply(
      chatInput,
      priorityTasks,
      generatedSchedule
    );

    setChat([
      ...chat,
      {
        role: "user",
        text: chatInput,
      },
      {
        role: "ai",
        text: reply,
      },
    ]);

    setChatInput("");
  }

  return (
    <div className="app">
      <AmbientSky />
      <Navbar
  page={page}
  setPage={setPage}
  isLogin={isLogin}
  user={user}
  onLogout={handleLogout}
  theme={theme}
  onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
/>

      <main>
        <div className="page-content" key={page}>
        {page === "landing" && (
          <Landing
            setPage={setPage}
            onOpenDemo={openDemo}
            nearestTask={nearestTask}
            completedTasks={completedTasks}
            totalTasks={tasks.length}
          />
        )}

        {page === "login" && (
  <Login onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />
)}

        {page === "dashboard" && (
          <Dashboard
            tasks={tasks}
            priorityTasks={priorityTasks}
            slots={slots}
            aiInsight={aiInsight}
            setPage={setPage}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {page === "tasks" && (
          <Tasks
            taskForm={taskForm}
            setTaskForm={setTaskForm}
            onAddTask={handleAddTask}
          />
        )}

        {page === "schedule" && (
          <Schedule
            slotForm={slotForm}
            setSlotForm={setSlotForm}
            slots={slots}
            generatedSchedule={generatedSchedule}
            onAddSlot={handleAddSlot}
            onDeleteSlot={handleDeleteSlot}
          />
        )}

        {page === "assistant" && (
          <Assistant
            chat={chat}
            chatInput={chatInput}
            setChatInput={setChatInput}
            onChatSubmit={handleChatSubmit}
          />
        )}

        {page === "settings" && <Settings onResetData={handleResetData} theme={theme} setTheme={setTheme} motion={motion} setMotion={setMotion} />}
        </div>
      </main>
      <footer className="site-footer"><span className="footer-brand">priorify<span>.ai</span></span><span>Designed for clear minds & big ambitions.</span><span className="footer-status"><i className="status-dot" /> {theme === "dark" ? "MIDNIGHT FOCUS" : "DAYLIGHT ENERGY"}</span></footer>
    </div>
  );
}

export default App;
