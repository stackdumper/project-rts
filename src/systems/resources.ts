import { System, Entity } from '~/core'
import { ResourceClock, ResourceResources, TResource, CResource } from '~/resources'

/**
 * SystemResources is responseible for managing resource consumption and production.
 */
export class SystemResources extends System {
  static id = 'resources'
  static query = {
    entities: false,
    components: [],
    resources: [ResourceResources, ResourceClock],
  }

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

  public dispatch(
    _: Set<Entity>,
    []: [],
    [{ energy, mass }, { dt }]: [ResourceResources, ResourceClock],
  ) {
    energy.update(this.incrementResource(energy, dt))
    mass.update(this.incrementResource(mass, dt))
  }
}
