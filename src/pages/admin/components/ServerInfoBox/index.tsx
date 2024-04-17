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
      <div className={styles.branchContainer}>
        <div className={styles.row}>
          <LiaCodeBranchSolid size={20} color="lightblue" />
          <span>{serverInfo?.branchHash.slice(0, 15)}</span>
        </div>

        <div className={styles.row}>
          <VscDebugDisconnect size={20} color="pink" />
          <span>{sockets}</span>
        </div>
      </div>
      <div className={styles.ramInfoContainer}>
        <div className={styles.totalRamInfo}>
          <MdMemory size={20} />
          <span
            className={cn({
              [styles.lowMemory]: true,
              [styles.mediumMemory]: memoryPercentage >= 40,
              [styles.highMemory]: memoryPercentage >= 70,
            })}
          >
            {`${Utils.formatMemory(memory?.totalMemoryUsage)} / ${Utils.formatMemory(memory?.totalMemory)}`}
          </span>
        </div>
        <div className={styles.appMemoryUsage}>
          <MdMemory size={20} />
          <span>{`${Utils.formatMemory(memory?.appMemoryUsage)}`}</span>
        </div>
      </div>
    </div>
  );
}
