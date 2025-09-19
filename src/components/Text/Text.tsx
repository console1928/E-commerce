import * as React from 'react'
import classNames from 'classnames';
import styles from './Text.module.scss';

export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  /** Html-тег */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  /** Начертание шрифта */
  weight?: 'normal' | 'medium' | 'bold';
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent';
  /** Максимальное кол-во строк */
  maxLines?: number;
};

const Text: React.FC<TextProps> = ({
  tag: Tag = 'p',
  view,
  weight,
  color,
  className,
  children,
  maxLines,
  ...rest
}) => {
  const classes = classNames(
    styles.text, // Использование стилей из модуля
    {
      [styles[`text--view-${view}`]]: view,
      [styles[`text--weight-${weight}`]]: weight,
      [styles[`text--color-${color}`]]: color,
      [styles['text--maxLines']]: maxLines,
    },
    className
  );

  const style = maxLines ? { WebkitLineClamp: maxLines } : undefined;

  return (
    <Tag className={classes} style={style} {...rest}>
      {children}
    </Tag>
  );
};

export default Text;