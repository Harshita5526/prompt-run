
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'medium',
}) {
  if (!open) return null

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.()
        }
      }}
    >
      <section
        className={`modal-card modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
      >
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </section>
    </div>
  )
}
