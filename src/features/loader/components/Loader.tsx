export const LoaderType = {
  DEFAULT: 'default',
  DOTS: 'dots',
  BAR: 'bar',
  CARDS:'cards'
} as const;
import FakeCardsLoader from './elements/FakeCardsLoader';
import styles from './Loader.module.css';
export type LoaderType = typeof LoaderType[keyof typeof LoaderType];

export interface LoaderProps {
  type?: LoaderType;
}

const Loader: React.FC<LoaderProps> = ({ type = LoaderType.DEFAULT }) => {
  const loaders = {
    [LoaderType.DEFAULT]: (
      <div
        className={styles.defaultLoader}
        role="status"
        aria-label="Loading"
        data-testid="loader-default"
      >
        <div className={styles.spinner}></div>
      </div>
    ),
    [LoaderType.DOTS]: (
      <div
        className={styles.dotsLoader}
        role="status"
        aria-label="Loading"
        data-testid="loader-dots"
      >
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    ),
    [LoaderType.BAR]: (
      <div
        className={styles.barLoader}
        role="status"
        aria-label="Loading"
        data-testid="loader-bar"
      >
        <div className={styles.bar}></div>
      </div>
    ),
    [LoaderType.CARDS]: (
      <FakeCardsLoader />
    ),
    
  };

  return loaders[type];
};

export default Loader;