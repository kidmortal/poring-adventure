import { useLocation, useNavigate } from 'react-router-dom';
import styles from './style.module.scss';
import { useBattleStore } from '@/store/battle';
import cn from 'classnames';
import { FaUser, FaTrophy, FaStore } from 'react-icons/fa';
import { GiCrossedSwords, GiShoppingBag } from 'react-icons/gi';

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  /** Battle locks the player in — the other screens stay unreachable until it ends. */
  lockedInBattle: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Profile', path: '/profile', icon: <FaUser />, lockedInBattle: true },
  { label: 'Rank', path: '/ranking', icon: <FaTrophy />, lockedInBattle: true },
  { label: 'Market', path: '/market', icon: <GiShoppingBag />, lockedInBattle: true },
  { label: 'Battle', path: '/battle', icon: <GiCrossedSwords />, lockedInBattle: false },
  { label: 'Store', path: '/store', icon: <FaStore />, lockedInBattle: false },
];

export function BottomNavBar() {
  const battleStore = useBattleStore();
  const userIsInBattle = !!battleStore.battle;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className={styles.container}>
      {NAV_ITEMS.map((item) => {
        const disabled = userIsInBattle && item.lockedInBattle;
        const active = pathname.startsWith(item.path);

        return (
          <button
            key={item.path}
            type="button"
            className={cn(styles.navItem, {
              [styles.disabled]: disabled,
              [styles.active]: active,
            })}
            onClick={() => {
              if (!disabled) navigate(item.path);
            }}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
