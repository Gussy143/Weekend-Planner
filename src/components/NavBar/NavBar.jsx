import { useNavigate } from 'react-router-dom'
import styles from './NavBar.module.css'

export const NavBar = ({
  title,
  leftButton,
  rightButton,
  onLeftClick,
  onRightClick,
  showBack = false,
  backLabel = '뒤로',
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <nav className={styles.navBar}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.navButton} onClick={handleBack}>
            ‹ {backLabel}
          </button>
        )}
        {leftButton && (
          <button className={styles.navButton} onClick={onLeftClick}>
            {leftButton}
          </button>
        )}
      </div>

      {title && (
        <div className={styles.center}>
          <div className={styles.navTitle}>{title}</div>
        </div>
      )}

      <div className={styles.right}>
        {rightButton && (
          <button className={styles.navButton} onClick={onRightClick}>
            {rightButton}
          </button>
        )}
      </div>
    </nav>
  )
}
