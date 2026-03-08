export default function ProgressBar({ progress, label }) {

  const value = Math.max(0, Math.min(100, progress));

  return (
    <div className="progress-wrapper">

      {label && (
        <div className="progress-header">
          <span className="progress-label">{label}</span>
          <span className="progress-value">{value}%</span>
        </div>
      )}

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${value}%` }}
        />
      </div>

    </div>
  );

}