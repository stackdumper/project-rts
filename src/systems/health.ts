import { System, Core } from '~/core'
import { ComponentHealth } from '~/components'

/**
 * SystemHealth is responsible for removing entities ran out of health.
 */
export class SystemHealth extends System {
  public update(core: Core) {
    for (const entity of core.entities.values()) {
      const health = entity.components.get(ComponentHealth)
      if (!health) continue

      if (health.health <= 0) {
        core.removeEntity(entity)
      }
    }
  }
}
