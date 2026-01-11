import content from '../../data/content.json';
import styles from './Header.module.css';  // Import CSS module
import type { ContentConfig } from '../../types/content.types';
export default function Header() {

  const { header } = content as ContentConfig;
  return (
    <div className={styles.header}><p className={styles.title}> {header.title} </p></div>
  )
}
