import { System, ComponentStorage } from '~/core'
import { ResourceClock, ResourceResources, ResourcePlacement } from '~/resources'
import { ComponentProducer, ComponentDraft, ComponentOwnership } from '~/components'

/**
 * SystemProduction is responsible for calculating produced and consumed mass and energy.
 */
export class SystemProduction extends System {
  static id = 'production'
  static query = {
    core: false,
    components: [ComponentProducer, ComponentOwnership, ComponentDraft],
    resources: [ResourceResources, ResourceClock],
  }

  public dispatch(
    _: never,
    [Producer, Ownership, Draft]: [
      ComponentStorage<ComponentProducer>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentDraft>,
    ],
    [resources, { dt }]: [ResourceResources, ResourceClock],
  ) {
    // reset consumption and production
    for (const { mass, energy } of resources.values()) {
      mass.production = 0
      mass.consumption = 0
      energy.production = 0
      energy.consumption = 0
    }

    // calculate static consumption and productino
    for (const [entity, [producer, ownership]] of ComponentStorage.join(
      Producer,
      Ownership,
    )) {
      // skip if not yet built
      if (Draft.has(entity)) continue

      const { mass, energy } = resources.get(ownership.playerID)!

      mass.current = Math.min(mass.current + (producer.mass / 60) * dt, mass.max)
      energy.current = Math.min(energy.current + (producer.energy / 60) * dt, energy.max)

      if (producer.mass > 0) {
        mass.production += producer.mass
      } else {
        mass.consumption += producer.mass
      }

      if (producer.energy > 0) {
        energy.production += producer.energy
      } else {
        energy.consumption += producer.energy
      }
    }

    // calculate dynamic consumption and production
    for (const { mass, energy } of resources.values()) {
      if (mass.current < mass.previous + mass.consumption) {
        mass.consumption += (mass.current - (mass.previous - mass.consumption)) * 60
      }

      if (energy.current < energy.previous + energy.consumption) {
        energy.consumption +=
          (energy.current - (energy.previous + energy.consumption)) * 60
      }

      // reset consumption and production
      mass.previous = mass.current
      energy.previous = energy.current
    }
  }
}
