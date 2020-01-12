import { System, Core } from '~/core'
import { ResourceClock, ResourceResources, TResource, CResource } from '~/resources'

/**
 * SystemResources is responseible for resource consumption and production.
 */
export class SystemResources extends System {
  static id = 'velocity'

  private incrementResource(resource: CResource, dt: number): TResource {
    return {
      current:
        resource.current < resource.max
          ? Math.min(resource.current + 3 * dt, resource.max)
          : resource.current,
      max: resource.max,
    }
  }

  public update(core: Core) {
    const resources = core.getResource(ResourceResources) as ResourceResources
    const clock = core.getResource(ResourceClock) as ResourceClock

    console.log(resources.energy.conversion)

    resources.energy.update(this.incrementResource(resources.energy, clock.dt))
    resources.mass.update(this.incrementResource(resources.mass, clock.dt))
  }
}
