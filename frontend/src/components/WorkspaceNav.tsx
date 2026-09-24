import { ShiftLinkLogo } from './ShiftLinkLogo'

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
        <ShiftLinkLogo className="workspace-logo" />

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
