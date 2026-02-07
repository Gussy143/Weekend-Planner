import styles from './List.module.css'

export const ListSection = ({ children, header }) => {
  return (
    <div className={styles.listSection}>
      {header && <div className={styles.sectionHeader}>{header}</div>}
      {children}
    </div>
  )
}

export const ListItem = ({
  children,
  title,
  subtitle,
  label,
  value,
  chevron = false,
  action = false,
  destructive = false,
  disabled = false,
  onClick,
}) => {
  const classes = [
    styles.listItem,
    action && styles.actionItem,
    destructive && styles.destructiveItem,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} onClick={!disabled ? onClick : undefined}>
      {/* Custom children */}
      {children && <div className={styles.itemContent}>{children}</div>}

      {/* Title + Subtitle layout */}
      {!children && (title || subtitle) && (
        <div className={styles.itemContent}>
          {title && <div className={styles.itemTitle}>{title}</div>}
          {subtitle && <div className={styles.itemSubtitle}>{subtitle}</div>}
        </div>
      )}

      {/* Label + Value layout */}
      {!children && !title && (label || value) && (
        <div className={`${styles.itemContent} ${styles.itemContentHorizontal}`}>
          {label && <div className={styles.itemLabel}>{label}</div>}
          {value && <div className={styles.itemValue}>{value}</div>}
        </div>
      )}

      {chevron && <div className={styles.chevron}>›</div>}
    </div>
  )
}
