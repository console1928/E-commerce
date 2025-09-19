import { Link } from 'react-router-dom';
import LalasiaLogoIcon from 'components/icons/LalasiaLogoIcon';
import LalasiaTextIcon from 'components/icons/LalasiaTextIcon';
import BagIcon from 'components/icons/BagIcon';
import UserIcon from 'components/icons/UserIcon';
import classes from './Header.module.scss';

const Header = () => (
    <header className={classes.header}>
        <div className="wrapper">
            <div className={classes.headerWrapper}>
                <div className={classes.logo}>
                    <LalasiaLogoIcon className={classes.logo__icon} width={42} height={42} />
                    <LalasiaTextIcon className={classes.logo__text} width={80} height={21} />
                </div>
                <nav className={classes.menu}>
                    <ul className={classes.menuList}>
                        <li className={`${classes.menuItem} ${classes.menuItem__active}`}>
                            <Link to="/">Products</Link>
                        </li>
                        <li className={classes.menuItem}>Categories</li>
                        <li className={classes.menuItem}>About us</li>
                    </ul>
                </nav>
                <nav className={classes.menuIcons}>
                    <BagIcon className={classes.menuIcons__bag} />
                    <UserIcon className={classes.menuIcons__user} />
                </nav>
            </div>
        </div>
    </header>
);

export default Header;