import React from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, afterSlot, className, disabled, ...props }, ref) => {
    const inputClass = classNames(
      styles.input,
      {
        [styles['input--disabled']]: disabled,
        [styles['input--with-after-slot']]: afterSlot,
      },
      className
    );

    return (
      <div className={inputClass}>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={event => onChange(event.target.value)}
          disabled={disabled}
          className={styles.input__field}
          {...props}
        />
        {afterSlot && (
          <div className={styles.input__afterSlot}>
            {afterSlot}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;