import { ShiftLinkLogo } from './ShiftLinkLogo'

type WorkspaceNavProps = {
  subtitle: string
  actionLabel: string
  onAction: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

export function WorkspaceNav({
  subtitle,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
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

      <div className="workspace-nav-actions">
        {secondaryActionLabel && onSecondaryAction && (
          <button
            className="install-button"
            type="button"
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </button>
        )}

        <button
          className="logout-button"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </nav>
  )
}
