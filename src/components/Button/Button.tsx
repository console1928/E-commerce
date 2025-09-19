import React from 'react';
import classNames from 'classnames';
import Loader from '../Loader';
import styles from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  /** Текст кнопки */
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  loading = false,
  children,
  className,
  disabled,
  type = 'button',
  ...props
}) => {
  const buttonClass = classNames(
    styles.btn,
    {
      [styles['btn--loading']]: loading,
      [styles['btn--disabled']]: disabled,
    },
    className
  );

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader size='s' className={styles.btn__loader} />}
      <span className={styles.btn__content}>{children}</span>
    </button>
  );
};

export default Button;