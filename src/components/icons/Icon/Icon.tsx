import * as React from 'react'
import styles from './Icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
    className?: string;
    color?: 'primary' | 'secondary' | 'accent';
    width?: number;
    height?: number;
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({ children, ...props }) => {
    const {
        className = '',
        color,
        width = 24,
        height = 24,
        style,
        ...restProps
    } = props;

    const iconClass = [
        styles.icon,
        color ? styles[`icon--${color}`] : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <svg
            className={iconClass}
            width={width}
            height={height}
            fill="currentColor"
            style={style}
            {...restProps}
        >
            {children}
        </svg>
    );
};

export default Icon;