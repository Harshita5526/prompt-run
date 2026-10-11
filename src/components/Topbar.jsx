
export default function Topbar({ day, setDay, title }) {
  const selectedDay = Number(day)
  const safeDay =
    Number.isInteger(selectedDay) && selectedDay >= 1 && selectedDay <= 30
      ? selectedDay
      : 1

  const handleDayChange = (event) => {
    if (typeof setDay === 'function') {
      setDay(Number(event.target.value))
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-heading">
        <div className="breadcrumb">
          <span>AFTER/MONEY</span>
          <span className="breadcrumb-divider">/</span>
          <span>YOUR DASHBOARD</span>
        </div>

        <h1>{title}</h1>
      </div>

      <div className="topbar-actions">
        <div className="challenge-badge">
          <span className="challenge-dot" />
          <span>30-DAY CHALLENGE</span>
        </div>

        <label className="day-selector">
          <span>DAY</span>

          <select
            value={safeDay}
            onChange={handleDayChange}
            aria-label="Select challenge day"
          >
            {Array.from({ length: 30 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {String(index + 1).padStart(2, '0')}
              </option>
            ))}
          </select>

          <span className="day-total">/ 30</span>
        </label>
      </div>
    </header>
  )
}
