import React from 'react';
import classNames from 'classnames';
import CheckIcon from '../icons/CheckIcon';
import styles from './Checkbox.module.scss';

export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  /** Вызывается при клике на чекбокс */
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  onChange,
  className,
  disabled,
  children,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const checkboxClass = classNames(
    styles.checkbox,
    {
      [styles['checkbox--disabled']]: disabled,
    },
    className
  );

  return (
    <label className={checkboxClass}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.checkbox__input}
        {...props}
      />
      {children && <span className={styles.checkbox__label}>{children}</span>}
      <div className={styles.checkbox__custom}>
        {checked && <CheckIcon width={40} height={40} color={disabled ? 'secondary' : 'accent'} />}
      </div>
    </label>
  );
};

export default CheckBox;