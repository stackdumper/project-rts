import { System, ComponentStorage, Core } from '~/core'
import { ComponentHealth } from '~/components'
import { ResourceClock } from '~/resources'

/**
 * SystemHealth is responsible for removing dead entities and healing damaged ones.
 */
export class SystemHealth extends System {
  static id = 'health'
  static query = {
    core: true,
    components: [ComponentHealth],
    resources: [ResourceClock],
  }

  public dispatch(
    core: Core,
    [Health]: [ComponentStorage<ComponentHealth>],
    [clock]: [ResourceClock],
  ) {
    for (const [entity, health] of Health.entries()) {
      if (health.current <= 0) {
        core.removeEntity(entity)
      }
    }
  }
}
