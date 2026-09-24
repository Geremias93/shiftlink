type AllClearStateProps = {
  title: string
  description: string
}

export function AllClearState({
  title,
  description,
}: AllClearStateProps) {
  return (
    <div className="all-clear">
      <div className="all-clear-icon">✓</div>

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  )
}
