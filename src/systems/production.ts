import { System, ComponentStorage } from '~/core'
import { ResourceClock, ResourceResources } from '~/resources'
import { ComponentProducer } from '~/components'

/**
 * SystemProduction is responsible for adding produced energy to energy resource.
 */
export class SystemProduction extends System {
  static id = 'resources'
  static query = {
    core: false,
    components: [ComponentProducer],
    resources: [ResourceResources, ResourceClock],
  }

  public dispatch(
    _: never,
    [sproducer]: [ComponentStorage<ComponentProducer>],
    [{ mass, energy }, { dt }]: [ResourceResources, ResourceClock],
  ) {
    mass.production = 0
    energy.production = 0

    for (const producer of sproducer.values()) {
      mass.current = Math.min(mass.current + (producer.mass / 60) * dt, mass.max)
      energy.current = Math.min(energy.current + (producer.energy / 60) * dt, energy.max)

      mass.production += producer.mass
      energy.production += producer.energy
    }
  }
}
