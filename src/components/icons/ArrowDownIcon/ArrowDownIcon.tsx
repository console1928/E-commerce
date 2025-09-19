import * as React from 'react'
import Icon, { IconProps } from '../Icon';

const ArrowDownIcon: React.FC<IconProps> = (props) => {
    return (
        <Icon {...props}>
            <path d="M0.335632 1.74741L1.66436 0.252594L10 7.66205L18.3356 0.252594L19.6644 1.74741L10 10.338L0.335632 1.74741Z" />
        </Icon>
    );
};

export default ArrowDownIcon;
