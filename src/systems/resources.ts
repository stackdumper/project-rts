import { System, Core } from '~/core'
import { ResourceClock, ResourceResources } from '~/resources'

/**
 * SystemResources is responseible for resource consumption and production.
 */
export class SystemResources extends System {
  static id = 'velocity'

  public update(core: Core) {
    const resources = core.getResource(ResourceResources) as ResourceResources
    const clock = core.getResource(ResourceClock) as ResourceClock

    resources.energy += 0.01 * clock.dt
    resources.mass += 0.01 * clock.dt
  }
}
