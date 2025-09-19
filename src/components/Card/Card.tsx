import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Text from '../Text';
import styles from './Card.module.scss';

export type CardProps = {
    /** Дополнительный classname */
    className?: string;
    /** URL изображения */
    image: string;
    /** Слот над заголовком */
    captionSlot?: React.ReactNode;
    /** Заголовок карточки */
    title: React.ReactNode;
    /** Описание карточки */
    subtitle: React.ReactNode;
    /** Содержимое карточки (футер/боковая часть), может быть пустым */
    contentSlot?: React.ReactNode;
    /** Клик на карточку */
    onClick?: React.MouseEventHandler;
    /** Слот для действия */
    actionSlot?: React.ReactNode;
    /** URL для перехода */
    url: string;
};

const Card: React.FC<CardProps> = ({
    className,
    image,
    captionSlot,
    title,
    subtitle,
    contentSlot,
    actionSlot,
    onClick,
    url
}) => {
    const cardClass = classNames(styles.card, className, {
        [styles['card--clickable']]: !!onClick,
    });

    return (
        <div className={cardClass} onClick={onClick}>
            <Link to={url}>
                <div className={styles['card__image-container']}>
                    <img
                        src={image}
                        alt=""
                        className={styles.card__image}
                        loading="lazy"
                    />
                </div>

                <div className={styles.card__content}>
                    {captionSlot && (
                        <div className={styles.card__caption}>
                            {captionSlot}
                        </div>
                    )}

                    <div className={styles.card__text}>
                        <Text className={styles.card__title} tag='h3' view='p-20' weight='bold'>{title}</Text>
                        <Text className={styles.card__subtitle} tag='p' view='p-16' weight='normal'>{subtitle}</Text>
                    </div>

                    {(contentSlot || actionSlot) && (
                        <div className={styles.card__footer}>
                            {contentSlot && (
                                <div className={styles['card__content-slot']}>
                                    {contentSlot}
                                </div>
                            )}
                            {actionSlot && (
                                <div className={styles['card__action-slot']}>
                                    {actionSlot}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default Card;