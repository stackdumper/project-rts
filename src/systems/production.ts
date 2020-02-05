import { System, ComponentStorage } from '~/core'
import { ResourceClock, ResourceResources } from '~/resources'
import { ComponentProducer, ComponentDraft } from '~/components'

/**
 * SystemProduction is responsible for calculating produced and consumed mass and energy.
 */
export class SystemProduction extends System {
  static id = 'production'
  static query = {
    core: false,
    components: [ComponentProducer, ComponentDraft],
    resources: [ResourceResources, ResourceClock],
  }

  private prev = {
    energy: 0,
    mass: 0,
  }

  public dispatch(
    _: never,
    [Producer, Draft]: [
      ComponentStorage<ComponentProducer>,
      ComponentStorage<ComponentDraft>,
    ],
    [{ mass, energy }, { dt }]: [ResourceResources, ResourceClock],
  ) {
    mass.production = 0
    energy.production = 0

    mass.consumption = (this.prev.mass - mass.current) * 60 * dt
    energy.consumption = (this.prev.energy - energy.current) * 60 * dt

    for (const [entity, producer] of Producer) {
      // skip if not yet built
      if (Draft.has(entity)) continue

      mass.current = Math.min(mass.current + (producer.mass / 60) * dt, mass.max)
      energy.current = Math.min(energy.current + (producer.energy / 60) * dt, energy.max)

      mass.production += producer.mass
      energy.production += producer.energy
    }

    this.prev.mass = mass.current
    this.prev.energy = energy.current
  }
}
