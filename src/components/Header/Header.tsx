import { Link } from 'react-router-dom';
import LalasiaLogoIcon from 'components/icons/LalasiaLogoIcon';
import LalasiaTextIcon from 'components/icons/LalasiaTextIcon';
import BagIcon from 'components/icons/BagIcon';
import UserIcon from 'components/icons/UserIcon';
import styles from './Header.module.scss';

const Header = () => (
    <header className={styles.header}>
        <div className="wrapper">
            <div className={styles.header__wrapper}>
                <div className={styles.header__logo}>
                    <LalasiaLogoIcon className={styles['header__logo-icon']} width={42} height={42} />
                    <LalasiaTextIcon className={styles['header__logo-text']} width={80} height={21} />
                </div>
                <nav className={styles.header__menu}>
                    <ul className={styles['header__menu-list']}>
                        <li className={`${styles['header__menu-item']} ${styles['header__menu-item--active']}`}>
                            <Link to="/">Products</Link>
                        </li>
                        <li className={styles['header__menu-item']}>Categories</li>
                        <li className={styles['header__menu-item']}>About us</li>
                    </ul>
                </nav>
                <nav className={styles.header__icons}>
                    <BagIcon className={styles['header__icons-bag']} />
                    <UserIcon className={styles['header__icons-user']} />
                </nav>
            </div>
        </div>
    </header>
);

export default Header;