function Tasks({ taskForm, setTaskForm, onAddTask }) {
  return (
    <section className="form-page">
      <div className="page-header">
        <div>
          <p className="badge">Input Data</p>
          <h2>Tambah Tugas Akademik</h2>
        </div>
      </div>

      <form className="form-card" onSubmit={onAddTask}>
        <div className="form-grid">
          <div>
            <label htmlFor="task-field-1">Nama Tugas</label>
            <input id="task-field-1"
              value={taskForm.title}
              onChange={(event) =>
                setTaskForm({ ...taskForm, title: event.target.value })
              }
              placeholder="Contoh: Laporan Praktikum AI"
            />
          </div>

          <div>
            <label htmlFor="task-field-2">Mata Kuliah</label>
            <input id="task-field-2"
              value={taskForm.course}
              onChange={(event) =>
                setTaskForm({ ...taskForm, course: event.target.value })
              }
              placeholder="Contoh: Kecerdasan Buatan"
            />
          </div>

          <div>
            <label htmlFor="task-field-3">Deadline</label>
            <input id="task-field-3"
              type="datetime-local"
              value={taskForm.deadline}
              onChange={(event) =>
                setTaskForm({ ...taskForm, deadline: event.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="task-field-4">Estimasi Waktu Pengerjaan</label>
            <input id="task-field-4"
              type="number"
              min="1"
              value={taskForm.estimate}
              onChange={(event) =>
                setTaskForm({ ...taskForm, estimate: event.target.value })
              }
              placeholder="Contoh: 4"
            />
          </div>

          <div>
            <label htmlFor="task-field-5">Tingkat Kesulitan</label>
            <select id="task-field-5"
              value={taskForm.difficulty}
              onChange={(event) =>
                setTaskForm({ ...taskForm, difficulty: event.target.value })
              }
            >
              <option>Mudah</option>
              <option>Sedang</option>
              <option>Sulit</option>
            </select>
          </div>

          <div>
            <label htmlFor="task-field-6">Tingkat Kepentingan</label>
            <select id="task-field-6"
              value={taskForm.importance}
              onChange={(event) =>
                setTaskForm({ ...taskForm, importance: event.target.value })
              }
            >
              <option>Rendah</option>
              <option>Sedang</option>
              <option>Tinggi</option>
            </select>
          </div>
        </div>

        <label htmlFor="task-field-7">Catatan Tugas</label>
        <textarea id="task-field-7"
          value={taskForm.notes}
          onChange={(event) =>
            setTaskForm({ ...taskForm, notes: event.target.value })
          }
          placeholder="Tambahkan catatan tugas..."
        />

        <button className="primary-btn">Simpan Tugas</button>
      </form>
    </section>
  );
}

export default Tasks;
