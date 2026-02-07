import styles from './Button.module.css'

export const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const classes = [
    styles.button,
    styles[variant],
    size === 'small' && styles.small,
    fullWidth && styles.fullWidth,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
