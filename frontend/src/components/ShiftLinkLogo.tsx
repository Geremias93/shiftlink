type ShiftLinkLogoProps = {
  className?: string
  title?: string
}

export function ShiftLinkLogo({
  className,
  title = 'ShiftLink',
}: ShiftLinkLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>

      <path
        d="
          M49 15
          H27
          C18 15 12 20 12 28
          C12 36 18 41 27 41
          H39
        "
        fill="none"
        stroke="#34D399"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="
          M15 49
          H37
          C46 49 52 44 52 36
          C52 28 46 23 37 23
          H25
        "
        fill="none"
        stroke="#3563E9"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
