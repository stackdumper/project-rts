import * as PIXI from 'pixi.js'
import { System, ComponentStorage, Core } from '~/core'
import {
  ComponentPosition,
  ComponentOwnership,
  ComponentWeaponry,
  ComponentHealth,
  ComponentTarget,
  ComponentVelocity,
  ComponentDimensions,
  ComponentTexture,
  ComponentProjectile,
  ComponentCollidable,
} from '~/components'
import { ResourceClock, ResourceResources, ResourceScene } from '~/resources'
import { Vector2 } from 'three/src/math/Vector2'

/**
 * SystemWeaponry is responsible for targeting and firing projectiles at hostile entities.
 */
export class SystemWeaponry extends System {
  static id = 'weaponry'
  static query = {
    core: true,
    components: [
      ComponentTarget,
      ComponentWeaponry,
      ComponentPosition,
      ComponentOwnership,
    ],
    resources: [ResourceClock],
  }

  public dispatch(
    core: Core,
    [Target, Weaponry, Position, Ownership]: [
      ComponentStorage<ComponentTarget>,
      ComponentStorage<ComponentWeaponry>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentOwnership>,
    ],
    [clock]: [ResourceClock],
  ) {
    for (const [entity, [target, weaponry, position, ownership]] of ComponentStorage.join(
      Target,
      Weaponry,
      Position,
      Ownership,
    )) {
      if (weaponry.cooldown > 0) {
        weaponry.cooldown -= clock.dt
        continue
      }

      if (target.target) {
        const targetPosition = Position.get(target.target)
        if (!targetPosition) {
          continue
        }

        // calculate velocity
        const velocity = targetPosition
          .clone()
          .add(new Vector2((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4))
          .sub(position.clone())
          .normalize()
          .multiplyScalar(weaponry.speed)

        // calculate projectile size
        const size = Math.max(Math.min(weaponry.damage * 0.05, 3), 1)

        // add projectile to world
        core.addEntity([
          new ComponentOwnership(ownership.playerID),
          new ComponentPosition(position.x, position.y),
          new ComponentVelocity(velocity.x, velocity.y),
          new ComponentDimensions(size, size),
          new ComponentTexture('projectile'),
          new ComponentProjectile(
            weaponry.damage,
            target.distance! / weaponry.speed + weaponry.range * 0.1 * Math.random(),
          ),
          new ComponentCollidable(),
        ])

        weaponry.cooldown = weaponry.reload
      }
    }
  }
}
