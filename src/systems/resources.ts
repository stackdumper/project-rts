import { System, Core } from '~/core'
import { ResourceClock, ResourceResources, TResource, CResource } from '~/resources'

/**
 * SystemResources is responseible for managing resource consumption and production.
 */
export class SystemResources extends System {
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
    const { energy, mass } = core.getResource(ResourceResources)
    const { dt } = core.getResource(ResourceClock)

    energy.update(this.incrementResource(energy, dt))
    mass.update(this.incrementResource(mass, dt))
  }
}
