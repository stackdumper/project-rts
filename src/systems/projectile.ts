import * as PIXI from 'pixi.js'
import { System, ComponentStorage, Core } from '~/core'
import {
  ComponentOwnership,
  ComponentProjectile,
  ComponentHealth,
  ComponentPosition,
  ComponentVelocity,
} from '~/components'
import { ResourceCollisions, ResourceScene, ResourceClock } from '~/resources'

/**
 * SystemProjectile is responsible for controling projectiles.
 */
export class SystemProjectile extends System {
  static id = 'projectile'
  static query = {
    core: true,
    components: [ComponentProjectile, ComponentOwnership, ComponentHealth],
    resources: [ResourceCollisions, ResourceClock],
  }

  public dispatch(
    core: Core,
    [Projectile, Ownership, Health]: [
      ComponentStorage<ComponentProjectile>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentHealth>,
    ],
    [collisions, clock]: [ResourceCollisions, ResourceClock],
  ) {
    for (const [entity, [projectile, ownership]] of ComponentStorage.join(
      Projectile,
      Ownership,
    )) {
      projectile.ttl -= clock.dt
      if (projectile.ttl <= 0) {
        core.removeEntity(entity)
        continue
      }

      const [target] = collisions.get(entity) || []
      if (!target) continue

      // skip for projectiles
      if (Projectile.has(target)) continue

      // skip if no health
      const targetHealth = Health.get(target)
      if (!targetHealth) continue

      // skip if the same ownership
      const targetOwnership = Ownership.get(target)
      if (!targetOwnership || targetOwnership.playerID === ownership.playerID) continue

      // make damage
      targetHealth.current -= projectile.damage

      // remove projectile
      core.removeEntity(entity)
    }
  }
}

// // debug
// scene.containers.map.addChild(
//   new PIXI.Graphics()
//     .moveTo(Position.get(target)!.x, Position.get(target)!.y)
//     .lineStyle(1, 0xff0000, 0.2)
//     .lineTo(Position.get(entity)!.x, Position.get(entity)!.y)
//     .endFill(),
// )
