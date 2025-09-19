import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowRightIcon from 'components/icons/ArrowRightIcon';
import styles from './Product.module.scss';

const ProductBackButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.backBtn} onClick={() => navigate(-1)}>
            <div className={styles.icon}>
                <ArrowRightIcon
                    className={styles.backIcon}
                    width={32}
                    height={32}
                    viewBox="0 0 24 24"
                    color="primary"
                />
            </div>
            <div className={styles.text}>Назад</div>
        </div>
    );
};

export default ProductBackButton;