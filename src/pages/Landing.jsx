import { useRef } from "react";
import Icon from "../components/Icon";
const features = [
  { icon: "task", number: "01", title: "Prioritas yang tepat.", label: "SMART PRIORITY", text: "Deadline, kesulitan, dan waktu pengerjaan. Semua diperhitungkan agar kamu tahu harus mulai dari mana.", page: "dashboard" },
  { icon: "calendar", number: "02", title: "Waktumu, lebih tertata.", label: "ADAPTIVE SCHEDULE", text: "Ubah waktu luang menjadi sesi belajar terarah. Jadwal disusun otomatis mengikuti kesibukanmu.", page: "schedule" },
  { icon: "spark", number: "03", title: "Teman berpikir, 24/7.", label: "PERSONAL ASSISTANT", text: "Butuh arah? Dapatkan rekomendasi dan pecah tugas besar menjadi langkah kecil yang bisa kamu selesaikan.", page: "assistant" },
];
export default function Landing({ setPage, onOpenDemo, nearestTask, completedTasks, totalTasks }) {
  const stage = useRef(null);
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  function moveScene(event) {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced") return;
    const box = event.currentTarget.getBoundingClientRect();
    stage.current.style.setProperty("--tilt-x", `${-(event.clientY - box.top - box.height / 2) / 65}deg`);
    stage.current.style.setProperty("--tilt-y", `${(event.clientX - box.left - box.width / 2) / 65}deg`);
  }
  function resetScene() { stage.current.style.setProperty("--tilt-x", "0deg"); stage.current.style.setProperty("--tilt-y", "0deg"); }
  return <section className="landing">
    <div className="hero">
      <div className="hero-text">
        <p className="badge"><span className="status-dot" /> SMARTER DAYS START HERE</p>
        <h1>Take control.<br /><span className="gradient-text">Find your flow.</span></h1>
        <p className="hero-description">Tugas menumpuk? Saatnya punya arah.<br />Atur prioritas, temukan waktu terbaik, dan selesaikan satu per satu bersama <strong>Priorify AI.</strong></p>
        <div className="hero-actions"><button className="primary-btn" onClick={() => setPage("login")}>Mulai Perjalananmu <Icon name="arrow" size={18} /></button><button className="secondary-btn" onClick={() => onOpenDemo("dashboard")}><Icon name="grid" size={17} /> Jelajahi Demo</button></div>
        <div className="hero-trust"><span><Icon name="check" size={14} /> Fokus lebih terarah</span><span><Icon name="check" size={14} /> Ritme belajarmu sendiri</span></div>
        <div className="hero-coordinate"><span>BUILT FOR YOUR NEXT BIG THING</span><span>↗</span></div>
      </div>
      <div className="mission-stage" ref={stage} onPointerMove={moveScene} onPointerLeave={resetScene}>
        <div className="stage-coordinate">P / 01 <span>PERSONAL FOCUS SYSTEM</span></div>
        <div className="scene-tilt">
          <div className="orbital-ring ring-back" /><div className="orbital-ring ring-front" />
          <div className="focus-core"><div className="core-longitude" /><div className="core-latitude" /><div className="core-symbol"><Icon name="bolt" size={56} /></div><span className="core-label">YOUR FOCUS, AMPLIFIED</span></div>
          <div className="floating-shape shape-diamond" /><div className="floating-shape shape-cube" /><div className="satellite-dot" />
          <div className="floating-note note-top"><span className="note-icon"><Icon name="spark" size={19} /></span><div><strong>Ruang untuk ide besar.</strong><span>Satu langkah setiap hari.</span></div><span className="note-live" /></div>
          <div className="hero-card floating-note priority-preview">
            <div className="preview-header"><span><i className="status-dot" /> FOCUS QUEUE</span><Icon name="task" size={16} /></div>
            <span className="preview-eyebrow">PRIORITAS BERIKUTNYA</span><strong className="preview-task">{nearestTask ? nearestTask.title : "Semua tugas selesai!"}</strong>
            <div className="preview-meta"><span><Icon name="clock" size={13} /> {nearestTask ? `${nearestTask.estimate} jam fokus` : "Waktunya recharge"}</span><span className="tiny-tag">{nearestTask ? nearestTask.priorityLabel : "Selesai"}</span></div>
            <div className="progress-info"><span>Perjalananmu</span><b>{completedTasks}<span> / {totalTasks} tugas</span></b></div><div className="progress-line" role="progressbar" aria-label="Tugas selesai" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><div style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="floating-note note-bottom"><span className="check-orb"><Icon name="check" size={18} /></span><div><strong>Small steps. Big progress.</strong><span>Setiap tugas selesai itu berarti.</span></div></div>
        </div>
        <div className="stage-caption"><span className="status-dot" /> TUNED TO YOUR AMBITION <span>∞ POSSIBILITIES</span></div>
      </div>
    </div>
    <div className="section-intro"><div><p className="eyebrow">UPGRADE YOUR EVERYDAY</p><h2>Lebih sedikit chaos.<br /><span className="text-muted">Lebih banyak yang tuntas.</span></h2></div><p>Satu ruang untuk menghubungkan<br />tugas, waktu, dan ide-idemu.</p></div>
    <div className="feature-grid">{features.map(feature => <button className="feature-card" key={feature.number} onClick={() => onOpenDemo(feature.page)}><div className="feature-top"><span className="feature-icon"><Icon name={feature.icon} size={23} /></span><span className="feature-number">/{feature.number}</span></div><span className="eyebrow">{feature.label}</span><h3>{feature.title}</h3><p>{feature.text}</p><span className="feature-link">Jelajahi fitur <Icon name="arrow" size={16} /></span></button>)}</div>
    <div className="landing-banner"><span className="banner-icon"><Icon name="bolt" size={30} /></span><div><h3>Make room for what matters.</h3><p>Ambisimu besar. Mulai dari satu tugas kecil hari ini.</p></div><button className="secondary-btn" onClick={() => setPage("login")}>Let's get started <Icon name="arrow" size={16} /></button></div>
  </section>;
}
