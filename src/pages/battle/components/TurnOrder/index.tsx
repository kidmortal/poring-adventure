import { Fragment } from 'react';
import cn from 'classnames';
import styles from './style.module.scss';

import { CharacterHead } from '@/components/Character/CharacterInfo';

type Props = {
  /** Names in the order they act, from the server. */
  attackerList: string[];
  attackerTurn: number;
  /** Passes through the whole order, counted from 1. */
  round: number;
  users: BattleUser[];
  monsters: Monster[];
};

/** How far ahead the order is worth showing before it just repeats. */
const LOOKAHEAD = 5;

type Actor = {
  name: string;
  user?: BattleUser;
  monster?: Monster;
  /** Position from now: 0 is acting, 1 is next. */
  distance: number;
};

/**
 * Who acts now and who comes after. The server keeps one flat order of names,
 * so this reads it forward from the current turn and wraps around.
 */
export function TurnOrder({ attackerList, attackerTurn, round, users, monsters }: Props) {
  const order = attackerList ?? [];
  if (order.length === 0) return null;

  const actors: Actor[] = Array.from({ length: Math.min(LOOKAHEAD, order.length) }, (_, step) => {
    const name = order[(attackerTurn + step) % order.length];
    return {
      name,
      distance: step,
      user: users.find((user) => user.name === name),
      monster: monsters.find((monster) => monster.name === name),
    };
  });

  // No "Now:" line — the chip that is lit and pulsing already says whose turn
  // it is, and the battlefield needs the height more. The track is the whole
  // strip now, so there is nothing to wrap it in.
  return (
    <div className={styles.track}>
        {/* How long this has been going on. A fight that enrages on a round, or
            a debuff quoted in rounds, is unreadable without it — and it anchors
            the left edge of a strip that otherwise starts mid-flow. */}
        <div className={styles.round}>
          <span className={styles.roundLabel}>Turn</span>
          <span className={styles.roundValue}>{round}</span>
        </div>

        <div className={styles.actors}>
        {actors.map((actor) => (
          <Fragment key={`${actor.name}-${actor.distance}`}>
            {/* Drawn in CSS: the order reads as a flow, not a row of tiles. */}
            {actor.distance > 0 && <span className={styles.arrow} aria-hidden />}
            <div
              className={cn(styles.actor, {
                [styles.current]: actor.distance === 0,
                [styles.next]: actor.distance === 1,
                [styles.dead]: actor.user?.isDead,
              })}
              title={actor.name}
            >
              <div className={styles.portrait}>
                {actor.user ? (
                  <CharacterHead
                    className={styles.head}
                    gender={actor.user.appearance?.gender ?? 'male'}
                    head={actor.user.appearance?.head ?? '1'}
                  />
                ) : (
                  <img className={styles.monster} src={actor.monster?.image} alt={actor.name} />
                )}
              </div>
              <span className={styles.name}>{actor.name}</span>
            </div>
          </Fragment>
        ))}
        </div>
      </div>
  );
}
