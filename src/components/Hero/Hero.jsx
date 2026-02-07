import styles from './Hero.module.css'

export const Hero = ({ title, subtitle, centered = false }) => {
  return (
    <div className={`${styles.hero} ${centered ? styles.centered : ''}`}>
      <div className={styles.heroContent}>
        {title && <h1 className={styles.heroTitle}>{title}</h1>}
        {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
      </div>
    </div>
  )
}
