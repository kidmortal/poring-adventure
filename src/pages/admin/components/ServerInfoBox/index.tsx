import { ServerInfo } from '@/api/services/adminService';
import styles from './style.module.scss';
import { LiaCodeBranchSolid } from 'react-icons/lia';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { MdMemory } from 'react-icons/md';
import { Utils } from '@/utils';
import cn from 'classnames';

export function ServerInfoBox({ serverInfo, sockets }: { serverInfo: ServerInfo; sockets: number }) {
  const memory = serverInfo?.memoryInfo;
  const memoryPercentage = Math.floor(((memory?.totalMemoryUsage ?? 0) / (memory?.totalMemory ?? 0)) * 100);

  return (
    <div className={styles.serverInfoContainer}>
      <Tile
        icon={<LiaCodeBranchSolid size={16} color="lightblue" />}
        label="Commit"
        value={serverInfo?.branchHash.slice(0, 8)}
      />
      <Tile icon={<VscDebugDisconnect size={16} color="pink" />} label="Sockets" value={String(sockets)} />
      <Tile
        icon={<MdMemory size={16} />}
        label={`Host ${memoryPercentage}%`}
        value={`${Utils.formatMemory(memory?.totalMemoryUsage)} / ${Utils.formatMemory(memory?.totalMemory)}`}
        valueClassName={cn({
          [styles.lowMemory]: memoryPercentage < 40,
          [styles.mediumMemory]: memoryPercentage >= 40 && memoryPercentage < 70,
          [styles.highMemory]: memoryPercentage >= 70,
        })}
      />
      <Tile
        icon={<MdMemory size={16} />}
        label="Process"
        value={Utils.formatMemory(memory?.appMemoryUsage)}
        valueClassName={styles.lowMemory}
      />
    </div>
  );
}

type TileProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  valueClassName?: string;
};

function Tile({ icon, label, value, valueClassName }: TileProps) {
  return (
    <div className={styles.tile}>
      <span className={styles.tileIcon}>{icon}</span>
      <span className={styles.tileText}>
        <span className={styles.tileLabel}>{label}</span>
        <span className={cn(styles.tileValue, valueClassName)} title={value}>
          {value}
        </span>
      </span>
    </div>
  );
}
