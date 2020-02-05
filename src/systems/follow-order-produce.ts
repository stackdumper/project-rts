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

  private completion = {
    energy: 0,
    mass: 0,
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
      if (orders.current && orders.current.action === 'produce' && !Draft.has(entity)) {
        const { cost } = orders.current.template
        const { mass, energy } = resources

        if (this.completion.energy < cost.energy || this.completion.mass < cost.mass) {
          const neededMass = cost.mass / (cost.time / engineering.rate) / (60 * clock.dt)
          const neededEnergy =
            cost.energy / (cost.time / engineering.rate) / (60 * clock.dt)

          if (mass.current >= neededMass && energy.current >= neededEnergy) {
            mass.current -= neededMass
            energy.current -= neededEnergy

            this.completion.mass += neededMass
            this.completion.energy += neededEnergy
          }
        } else {
          // add entity
          orders.current.template
            .getComponent(ComponentPosition)
            .set(position.x, position.y)

          // TEMP: add move order
          orders.current.template.getComponent(ComponentOrders).push({
            action: 'move',
            position: new Vector2(position.x, position.y + 92),
          })

          core.addEntity(orders.current.template.build(ownership.playerID))

          // remove orders
          orders.shift()

          // reset completion
          this.completion = {
            energy: 0,
            mass: 0,
          }
        }
      }
    }
  }
}
