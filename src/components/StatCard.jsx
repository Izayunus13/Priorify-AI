import Icon from "./Icon";
const icons = { "Total Tugas": "task", "Tugas Aktif": "bolt", "Tugas Selesai": "check", "Jadwal Kosong": "calendar" };
export default function StatCard({ title, value, description }) {
  return <div className="stat-card"><div className="stat-top"><span>{title}</span><span className="stat-icon"><Icon name={icons[title]} size={18} /></span></div><strong>{String(value).padStart(2, "0")}</strong>{description && <p>{description}</p>}<div className="stat-decoration" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div></div>;
}
