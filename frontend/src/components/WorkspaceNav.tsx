type WorkspaceNavProps = {
  subtitle: string
  actionLabel: string
  onAction: () => void
}

export function WorkspaceNav({
  subtitle,
  actionLabel,
  onAction,
}: WorkspaceNavProps) {
  return (
    <nav className="workspace-nav">
      <div className="workspace-brand">
        <div className="workspace-logo">S</div>

        <div>
          <strong>ShiftLink</strong>
          <span>{subtitle}</span>
        </div>
      </div>

      <button
        className="logout-button"
        type="button"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </nav>
  )
}
