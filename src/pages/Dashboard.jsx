import StatCard from "../components/StatCard";
import PriorityBadge from "../components/PriorityBadge";

function Dashboard({
  tasks,
  priorityTasks,
  slots,
  aiInsight,
  setPage,
  onUpdateStatus,
  onDeleteTask,
}) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Selesai").length;
  const activeTasks = tasks.filter((task) => task.status !== "Selesai").length;

  function formatDaysLeft(daysLeft) {
    if (daysLeft < 0) return "Terlambat";
    if (daysLeft === 0) return "Hari ini";
    if (daysLeft === 1) return "Besok";
    return `${daysLeft} hari lagi`;
  }

  function getDaysBadgeClass(daysLeft) {
    if (daysLeft <= 3) return "days-pill-red";
    if (daysLeft <= 7) return "days-pill-orange";
    return "days-pill-green";
  }

  return (
    <section className="dashboard">
      <div className="page-header">
        <div>
          <p className="badge">Dashboard</p>
          <h2>Your focus, at a glance.</h2>
          <p className="muted">Semua prioritasmu, satu langkah lebih dekat untuk selesai.</p>
        </div>

        <button className="primary-btn" onClick={() => setPage("tasks")}>
          + Tambah Tugas
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Tugas" value={totalTasks} />
        <StatCard title="Tugas Aktif" value={activeTasks} />
        <StatCard title="Tugas Selesai" value={completedTasks} />
        <StatCard title="Jadwal Kosong" value={slots.length} />
      </div>

      <div className="content-grid">
        <div className="panel">
          <h3>AI Insight</h3>
          <p className="insight-text">{aiInsight}</p>
        </div>

        <div className="panel">
          <h3>Prioritas Teratas</h3>

          {priorityTasks.slice(0, 3).map((task, index) => (
            <div className="priority-item" key={task.id}>
              <div className="number">{index + 1}</div>

              <div>
                <strong>{task.title}</strong>
                <p>
                  {task.course}
                </p>
                <PriorityBadge label={task.priorityLabel} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3>Daftar Tugas</h3>

        <div className="table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th>Tugas</th>
                <th>Mata Kuliah</th>
                <th>Deadline</th>
                <th>Sisa Hari</th>
                <th>Prioritas</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {priorityTasks.map((task) => (
                <tr key={task.id}>
                  <td className="task-title-cell">{task.title}</td>

                  <td className="course-cell">{task.course}</td>

                  <td className="deadline-cell">
                    {new Date(task.deadline).toLocaleString("id-ID")}
                  </td>

                  <td className="days-cell">
                    <span className={`days-pill ${getDaysBadgeClass(task.daysLeft)}`}>
                      {formatDaysLeft(task.daysLeft)}
                    </span>
                  </td>

                  <td className="priority-cell">
                    <PriorityBadge label={task.priorityLabel} />
                  </td>

                  <td className="status-cell">
                    <select
                      aria-label={`Status tugas ${task.title}`}
                      value={task.status}
                      onChange={(event) =>
                        onUpdateStatus(task.id, event.target.value)
                      }
                    >
                      <option>Belum dikerjakan</option>
                      <option>Sedang dikerjakan</option>
                      <option>Selesai</option>
                    </select>
                  </td>

                  <td className="action-cell">
                    <button
                      className="danger-btn"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel formula-panel">
        <h3>Dasar Penentuan Prioritas</h3>

        <div className="formula-box">
            <strong>
                Prioritas tugas ditentukan berdasarkan urgensi deadline, tingkat kesulitan,
                kepentingan, estimasi waktu pengerjaan, dan status tugas.
            </strong>
            </div>

        <div className="formula-grid">
          <div>
            <span>Urgensi Deadline</span>
            <p>
              Semakin dekat deadline, semakin besar nilai prioritas tugas.
            </p>
          </div>

          <div>
            <span>Tingkat Kesulitan</span>
            <p>
              Tugas sulit mendapatkan nilai lebih tinggi karena butuh waktu dan
              fokus lebih besar.
            </p>
          </div>

          <div>
            <span>Kepentingan</span>
            <p>
              Tugas dengan tingkat kepentingan tinggi akan lebih diprioritaskan.
            </p>
          </div>

          <div>
            <span>Estimasi Waktu</span>
            <p>
              Tugas yang membutuhkan waktu lama akan disarankan untuk dicicil
              lebih awal.
            </p>
          </div>

          <div>
            <span>Penalti Status</span>
            <p>
              Tugas yang sedang dikerjakan atau sudah selesai akan dikurangi
              nilainya.
            </p>
          </div>
        </div>
      </div>

      <div className="panel workflow-panel">
        <h3>Cara Kerja Priorify AI</h3>

        <div className="workflow-grid">
          <div className="workflow-card">
            <span>01</span>
            <strong>Input Tugas</strong>
            <p>
              Pengguna memasukkan nama tugas, mata kuliah, deadline, estimasi
              waktu, kesulitan, dan kepentingan.
            </p>
          </div>

          <div className="workflow-card">
            <span>02</span>
            <strong>Hitung Prioritas</strong>
            <p>
              Sistem menghitung skor prioritas berdasarkan deadline, tingkat
              kesulitan, kepentingan, estimasi waktu, dan status tugas.
            </p>
          </div>

          <div className="workflow-card">
            <span>03</span>
            <strong>Susun Jadwal</strong>
            <p>
              Sistem membagi tugas ke dalam jadwal kosong yang dimasukkan
              pengguna secara otomatis.
            </p>
          </div>

          <div className="workflow-card">
            <span>04</span>
            <strong>AI Insight</strong>
            <p>
              AI memberikan rekomendasi tugas yang perlu dikerjakan lebih dulu
              dan alasan prioritasnya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
