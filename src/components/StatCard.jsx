
export default function StatCard({ icon, label, value, note, tone }) {
  return (
    <div className={`stat-card ${tone || ''}`}>
      <div className="stat-card-icon">
        <span>{icon}</span>
      </div>

      <div className="stat-card-content">
        <p>{label}</p>
        <h3>{value}</h3>
        {note != null && note !== '' && (
          <small>{note}</small>
        )}
      </div>
    </div>
  )
}
