import Icon from "../components/Icon";
export default function Settings({ onResetData, theme, setTheme, motion, setMotion }) {
  return <section className="settings-page">
    <div className="page-header"><div><p className="badge">PERSONALIZE YOUR SPACE</p><h2>Ruangmu. Gayamu.</h2><p className="muted">Sesuaikan suasana untuk menemukan fokus terbaikmu.</p></div></div>
    <div className="panel appearance-panel"><div className="panel-heading"><span className="feature-icon"><Icon name="sun" /></span><div><h3>Suasana & tampilan</h3><p className="muted">Langit berganti, fokus tetap mengalir. Pilihanmu tersimpan otomatis.</p></div></div>
      <div className="theme-options">{[["light", "Daylight", "Langit biru, energi baru.", "sun"], ["dark", "Midnight", "Tenang, imersif, penuh fokus.", "moon"]].map(([value, title, text, icon]) => <button key={value} className={`theme-option ${theme === value ? "selected" : ""}`} onClick={() => setTheme(value)} aria-pressed={theme === value}><span className={`theme-preview preview-${value}`}><span className="preview-planet" /><span className="preview-lines" /></span><span className="theme-option-info"><Icon name={icon} /><span><strong>{title}</strong><small>{text}</small></span><span className="selection-circle">{theme === value && <Icon name="check" size={13} />}</span></span></button>)}</div>
      <div className="motion-setting"><div><strong>Animasi & efek melayang</strong><p className="muted">Rotasi langit, orbit 3D, dan gerakan antarmuka. Preferensi pengurangan gerak perangkat tetap diikuti.</p></div><label className="switch" aria-label="Aktifkan animasi"><input type="checkbox" checked={motion} onChange={event => setMotion(event.target.checked)} /><span /></label></div>
    </div>
    <div className="panel"><div className="panel-heading"><span className="feature-icon"><Icon name="spark" /></span><div><h3>AI Assistant</h3><p className="muted">Asisten saat ini menggunakan simulasi berbasis data tugas dan jadwalmu untuk membantu menentukan prioritas.</p></div></div></div>
    <div className="panel reset-panel"><h3>Mulai dari awal</h3><p className="muted">Kembalikan tugas dan jadwal ke data contoh awal.</p><button className="danger-btn" onClick={onResetData}>Reset Data Prototype</button></div>
  </section>;
}
