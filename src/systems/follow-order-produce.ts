import { System, ComponentStorage, Core } from '~/core'
import {
  ComponentOrders,
  ComponentDraft,
  ComponentEngineering,
  ComponentOwnership,
  ComponentPosition,
} from '~/components'
import { ResourceResources, ResourceClock } from '~/resources'
import { Vector2 } from 'three/src/math/Vector2'

/**
 * SystemFollowOrderProduce is responsible for making entities follor produce order.
 */
export class SystemFollowOrderProduce extends System {
  static id = 'follow-order-produce'
  static query = {
    core: true,
    components: [
      ComponentOrders,
      ComponentEngineering,
      ComponentOwnership,
      ComponentPosition,
      ComponentDraft,
    ],
    resources: [ResourceResources, ResourceClock],
  }

  public dispatch(
    core: Core,
    [Orders, Engineering, Ownership, Position, Draft]: [
      ComponentStorage<ComponentOrders>,
      ComponentStorage<ComponentEngineering>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDraft>,
    ],
    [resources, clock]: [ResourceResources, ResourceClock],
  ) {
    for (const [
      entity,
      [orders, engineering, ownership, position],
    ] of ComponentStorage.join(Orders, Engineering, Ownership, Position)) {
      const { current } = orders

      if (current && current.action === 'produce' && !Draft.has(entity)) {
        const { cost } = current.template
        const { mass, energy } = resources.get(ownership.playerID)!

        // check if not completed
        if (current.energy < cost.energy || current.mass < cost.mass) {
          // calculate energy and mass fractions
          const neededMass = cost.mass / (cost.time / engineering.rate) / (60 * clock.dt)
          const neededEnergy =
            cost.energy / (cost.time / engineering.rate) / (60 * clock.dt)

          // check if enough resources
          if (mass.current >= neededMass && energy.current >= neededEnergy) {
            // pour energy and mass
            mass.current -= neededMass
            energy.current -= neededEnergy

            current.mass += neededMass
            current.energy += neededEnergy

            current.percentage =
              (current.mass / cost.mass) * 0.5 + (current.energy / cost.energy) * 0.5
          }
        } else {
          // add entity
          const entity = core.addEntity(current.template.build(ownership.playerID))

          // set position to be in factory
          Position.get(entity)!.set(position.x, position.y)

          // add order to move out of factory
          Orders.get(entity)!.push({
            action: 'move',
            position: new Vector2(position.x, position.y + 92),
          })

          // remove orders
          orders.shift()
        }
      }
    }
  }
}
