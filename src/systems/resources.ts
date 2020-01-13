import { System, Core } from '~/core'
import { ResourceClock, ResourceResources, TResource, CResource } from '~/resources'

/**
 * SystemResources is responseible for resource consumption and production.
 */
export class SystemResources extends System {
  static id = 'velocity'

  private incrementResource(resource: CResource, dt: number): TResource {
    const nextCurrent = Math.max(
      Math.min(
        resource.current + (resource.production - resource.consumption) * dt,
        resource.max,
      ),
      0,
    )

    return {
      current: nextCurrent,
      max: resource.max,
      production: resource.production,
      consumption: resource.consumption,
    }
  }

  public update(core: Core) {
    const { energy, mass } = core.getResource(ResourceResources) as ResourceResources
    const { dt } = core.getResource(ResourceClock) as ResourceClock

    energy.update(this.incrementResource(energy, dt))
    mass.update(this.incrementResource(mass, dt))
  }
}
