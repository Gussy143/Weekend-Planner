import styles from './Input.module.css'

export const Input = ({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  ...props
}) => {
  return (
    <div className={styles.inputItem}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={styles.input}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}

export const TextArea = ({
  label,
  error,
  placeholder,
  value,
  onChange,
  disabled,
  rows = 4,
  ...props
}) => {
  return (
    <div className={styles.inputItem}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={`${styles.input} ${styles.textarea}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        {...props}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
