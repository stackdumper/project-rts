import * as PIXI from 'pixi.js'
import { System, ComponentStorage, Core } from '~/core'
import {
  ComponentOwnership,
  ComponentProjectile,
  ComponentHealth,
  ComponentPosition,
  ComponentVelocity,
} from '~/components'
import { ResourceCollisions, ResourceScene } from '~/resources'

/**
 * SystemProjectile is responsible for controling projectiles.
 */
export class SystemProjectile extends System {
  static id = 'projectile'
  static query = {
    core: true,
    components: [
      ComponentProjectile,
      ComponentOwnership,
      ComponentHealth,
      ComponentPosition,
      ComponentVelocity,
    ],
    resources: [ResourceCollisions, ResourceScene],
  }

  public dispatch(
    core: Core,
    [Projectile, Ownership, Health, Position, Velocity]: [
      ComponentStorage<ComponentProjectile>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentHealth>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentVelocity>,
    ],
    [collisions, scene]: [ResourceCollisions, ResourceScene],
  ) {
    for (const [entity, [projectile, ownership]] of ComponentStorage.join(
      Projectile,
      Ownership,
    )) {
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

      targetHealth.current -= projectile.damage
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
