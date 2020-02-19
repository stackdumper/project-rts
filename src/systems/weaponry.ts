import { System, ComponentStorage, Core } from '~/core'
import {
  ComponentPosition,
  ComponentOwnership,
  ComponentWeaponry,
  ComponentVelocity,
  ComponentHealth,
  ComponentDimensions,
  ComponentTexture,
  ComponentProjectile,
} from '~/components'
import { ResourceClock } from '~/resources'

/**
 * SystemWeaponry is responsible for targeting and firing projectiles at hostile entities.
 */
export class SystemWeaponry extends System {
  static id = 'weaponry'
  static query = {
    core: true,
    components: [
      ComponentWeaponry,
      ComponentOwnership,
      ComponentPosition,
      ComponentHealth,
    ],
    resources: [ResourceClock],
  }

  public dispatch(
    core: Core,
    [Weaponry, Ownership, Position, Health]: [
      ComponentStorage<ComponentWeaponry>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentHealth>,
    ],
    [clock]: [ResourceClock],
  ) {
    for (const [entity, [weaponry, ownership, position]] of ComponentStorage.join(
      Weaponry,
      Ownership,
      Position,
    )) {
      if (weaponry.cooldown > 0) {
        weaponry.cooldown -= clock.dt
        continue
      }

      for (const [
        targetEntity,
        [targetOwnership, targetPosition, _Health],
      ] of ComponentStorage.join(Ownership, Position, Health)) {
        // skip if the same entity or have same ownership
        if (entity === targetEntity || ownership.playerID === targetOwnership.playerID) {
          continue
        }

        // skip is out of firing range
        const distance = position.distanceTo(targetPosition)
        if (distance > weaponry.range) {
          continue
        }

        // calculate velocity
        const velocity = targetPosition
          .clone()
          .sub(position.clone())
          .normalize()
          .multiplyScalar(weaponry.speed)

        // add entity lazily to prevent lag when adding many projectiles
        core.addEntityLazy([
          new ComponentOwnership(ownership.playerID),
          new ComponentPosition(position.x, position.y),
          new ComponentVelocity(velocity.x, velocity.y),
          new ComponentDimensions(2, 2),
          new ComponentTexture('projectile'),
          new ComponentProjectile(
            weaponry.damage,
            distance / weaponry.speed + 32 / weaponry.speed,
          ),
        ])

        weaponry.cooldown = weaponry.reload
        break
      }

      if (weaponry.cooldown <= 0) {
        weaponry.cooldown = weaponry.reload / 3
      }
    }
  }
}
