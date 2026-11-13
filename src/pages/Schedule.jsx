import EmptyState from "../components/EmptyState";

function Schedule({
  slotForm,
  setSlotForm,
  slots,
  generatedSchedule,
  onAddSlot,
  onDeleteSlot,
}) {
  return (
    <section className="schedule-page">
      <div className="page-header">
        <div>
          <p className="badge">Schedule Generator</p>
          <h2>Input Jadwal Kosong</h2>
        </div>
      </div>

      <form className="form-card" onSubmit={onAddSlot}>
        <div className="form-grid">
          <div>
            <label htmlFor="slot-day">Hari</label>
            <select id="slot-day"
              value={slotForm.day}
              onChange={(event) =>
                setSlotForm({ ...slotForm, day: event.target.value })
              }
            >
              <option>Senin</option>
              <option>Selasa</option>
              <option>Rabu</option>
              <option>Kamis</option>
              <option>Jumat</option>
              <option>Sabtu</option>
              <option>Minggu</option>
            </select>
          </div>

          <div>
            <label htmlFor="slot-start">Jam Mulai</label>
            <input id="slot-start"
              type="time"
              value={slotForm.start}
              onChange={(event) =>
                setSlotForm({ ...slotForm, start: event.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="slot-end">Jam Selesai</label>
            <input id="slot-end"
              type="time"
              value={slotForm.end}
              onChange={(event) =>
                setSlotForm({ ...slotForm, end: event.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="slot-note">Keterangan</label>
            <input id="slot-note"
              value={slotForm.note}
              onChange={(event) =>
                setSlotForm({ ...slotForm, note: event.target.value })
              }
              placeholder="Contoh: Setelah kuliah"
            />
          </div>
        </div>

        <button className="primary-btn">Tambah Jadwal Kosong</button>
      </form>

      <div className="content-grid">
        <div className="panel">
          <h3>Jadwal Kosong</h3>

          {slots.length === 0 && <EmptyState text="Belum ada jadwal kosong." />}

          {slots.map((slot) => (
            <div className="slot-item" key={slot.id}>
              <div>
                <strong>{slot.day}</strong>
                <p>
                  {slot.start} - {slot.end} • {slot.note || "Tanpa keterangan"}
                </p>
              </div>

              <button
                className="danger-btn"
                onClick={() => onDeleteSlot(slot.id)}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Hasil Jadwal Otomatis</h3>

          {generatedSchedule.length === 0 && (
            <EmptyState text="Belum ada jadwal otomatis. Tambahkan tugas dan waktu kosong dulu." />
          )}

          {generatedSchedule.map((item) => (
            <div className="schedule-item" key={item.id}>
              <span>{item.day}</span>
              <strong>{item.time}</strong>
              <p>
                Kerjakan <b>{item.task}</b> selama {item.duration} jam.
              </p>
              <small>{item.reason}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Schedule;
