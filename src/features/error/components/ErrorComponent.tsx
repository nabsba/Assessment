import styles from './ErrorComponent.module.css';
import errorContent from '../data/content.json';
import type { ErrorsContent } from '../data/type';


export const ErrorType = {
  DEFAULT: 'default',
  NOT_FOUND: '404',
  NETWORK: 'network',
  SERVER: '500',
  UNAUTHORIZED: '401',
  FORBIDDEN: '403',
  RATE_LIMIT: '429',
  VALIDATION: '400',
  GITHUB_API: 'github_api'
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface ErrorComponentProps {
  type?: ErrorType | string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  statusCode?: number;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  type,
  message,
  onRetry,
  className = '',
  statusCode
}) => {
  const { errors } = errorContent as ErrorsContent;


  let errorType: string = type || ErrorType.DEFAULT;

  if (statusCode && errors[statusCode.toString()]) {
    errorType = statusCode.toString();
  }

console.log(errorType)
  const errorConfig = errors[errorType] || errors.default;

 
  const errorMessage = message || errorConfig.message;

  return (
    <div
      className={`${styles.errorContainer} ${styles[errorType]} ${className}`}
      role="alert"
      aria-live="assertive"
      data-testid={`error-${errorType}`}
    >
      <div className={styles.errorIcon} aria-hidden="true">
        {errorConfig.icon}
      </div>
      <h3 className={styles.errorTitle}>{errorConfig.title}</h3>
      <p className={styles.errorMessage}>{errorMessage}</p>
      {onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          aria-label={errorConfig.buttonText}
          data-testid="error-retry-button"
        >
          {errorConfig.buttonText}
        </button>
      )}
    </div>
  );
};

export default ErrorComponent;