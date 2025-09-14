import * as React from 'react'
import Icon, { IconProps } from '../Icon';

const CheckIcon: React.FC<IconProps> = (props) => {
    return (
        <Icon {...props}>
            <path
                d="M1 5.6129L6.87755 12L17 1"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
            />
        </Icon>
    );
};

export default CheckIcon;
