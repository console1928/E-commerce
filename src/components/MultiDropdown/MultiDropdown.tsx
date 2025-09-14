import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import Input from '../Input';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import styles from './MultiDropdown.module.scss';

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className,
  options,
  value,
  onChange,
  disabled,
  getTitle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOutside = !(event.target === dropdownRef.current || dropdownRef.current?.contains(event.target as Node));

      if (isClickOutside && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const filtered = options.filter((option) => option.value.toLowerCase().includes(value.toLowerCase()));
    setFilteredOptions(filtered);
  };

  const handleOptionClick = (option: Option) => {
    const updatedValue = [...value];
    const index = updatedValue.findIndex((v) => v.key === option.key);
    index > -1 ? updatedValue.splice(index, 1) : updatedValue.push(option);
    onChange(updatedValue);
  };

  const handleToggleDropDown = (event: React.MouseEvent<Element, MouseEvent>) => {
    if (disabled) return;
    event.stopPropagation();
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    setInputValue(value.length === 0 ? '' : getTitle(value));
  }, [value, getTitle]);

  return (
    <div className={classNames(styles.multiDropdown, className)}>
      <div onClick={handleToggleDropDown}>
        <Input
          className={styles.multiDropdown__input}
          ref={inputRef}
          onChange={handleInputChange}
          afterSlot={<ArrowDownIcon color="secondary" />}
          value={inputValue}
          placeholder={getTitle(value)}
          disabled={disabled}
        />
      </div>
      {isOpen && !disabled && (
        <React.Fragment>
          {filteredOptions.length === 0 ? (
            <div className={styles.multiDropdown__noOptions}>
              Nothing found
            </div>
          ) : (
            <div className={styles.multiDropdown__options} ref={dropdownRef}>
              {filteredOptions.map((option) => {
                const isSelected = value.some(item => item.key === option.key);

                return (
                  <div
                    key={option.key}
                    className={classNames(styles.multiDropdown__option, {
                      [styles['multiDropdown__option--selected']]: isSelected,
                    })}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.value}
                  </div>
                )
              })}
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default MultiDropdown;