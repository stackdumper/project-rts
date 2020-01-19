import { System, Core } from '~/core'
import { ResourceClock } from '~/resources'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentProjectile,
  ComponentOwnership,
  ComponentHealth,
  ComponentDimensions,
} from '~/components'

/**
 * SystemProjectile is responsible for projectile handling.
 */
export class SystemProjectile extends System {
  public update(core: Core) {
    for (const entity of core.entities.values()) {
      const projectile = entity.components.get(ComponentProjectile)
      if (!projectile) continue

      const ownership = entity.components.get(ComponentOwnership)
      if (!ownership) continue

      const position = entity.components.get(ComponentPosition)
      if (!position) continue

      for (const targetEntity of core.entities.values()) {
        const targetOwnership = targetEntity.components.get(ComponentOwnership)
        if (!targetOwnership || targetOwnership.playerID === ownership.playerID) continue

        const targetPosition = targetEntity.components.get(ComponentPosition)
        if (!targetPosition) continue

        const targetDimensions = targetEntity.components.get(ComponentDimensions)
        if (!targetDimensions) continue

        const targetHealth = targetEntity.components.get(ComponentHealth)
        if (!targetHealth) continue

        // check intersection
        const { x, y } = targetPosition
        const { max, min } = targetDimensions
        const intersects =
          position.x > x + min.x &&
          position.y > y + min.y &&
          position.x < x + max.x &&
          position.y < y + max.y

        if (intersects) {
          targetHealth.health -= projectile.damage

          core.removeEntity(entity)

          break
        }
      }
    }
  }
}
