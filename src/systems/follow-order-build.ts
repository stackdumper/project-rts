import { System, ComponentStorage, Core } from '~/core'
import {
  ComponentPosition,
  ComponentOrders,
  ComponentEngineering,
  ComponentDraft,
  ComponentVelocity,
  ComponentOwnership,
} from '~/components'
import { ResourceResources, ResourceClock } from '~/resources'

/**
 * SystemFollowOrderMove is responsible for making entities follor move order.
 */
export class SystemFollowOrderBuild extends System {
  static id = 'follow-order-build'
  static query = {
    core: false,
    components: [
      ComponentOrders,
      ComponentPosition,
      ComponentEngineering,
      ComponentOwnership,
      ComponentVelocity,
      ComponentDraft,
    ],
    resources: [ResourceClock, ResourceResources],
  }

  public dispatch(
    _: never,
    [Orders, Position, Engineering, Ownership, Velocity, Draft]: [
      ComponentStorage<ComponentOrders>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentEngineering>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentVelocity>,
      ComponentStorage<ComponentDraft>,
    ],
    [clock, resources]: [ResourceClock, ResourceResources],
  ) {
    for (const [e, [orders, position, engineering, ownership]] of ComponentStorage.join(
      Orders,
      Position,
      Engineering,
      Ownership,
    )) {
      if (!orders.current || orders.current.action !== 'construct') continue

      const distanceDiff =
        position.distanceTo(orders.current.position) - engineering.range

      // if in range, build
      // else, add move closer order
      if (distanceDiff < 5) {
        // stop moving
        Velocity.get(e)!.set(0.0, 0.0)

        const { entity, template } = orders.current

        // if not yet completed,
        // fill draft with mass and energy
        const draft = Draft.get(entity)

        if (
          draft &&
          (draft.mass < template.cost.mass || draft.energy < template.cost.energy)
        ) {
          const { cost } = template
          const { mass, energy } = resources.get(ownership.playerID)!

          const neededMass = cost.mass / (cost.time / engineering.rate) / (60 * clock.dt)
          const neededEnergy =
            cost.energy / (cost.time / engineering.rate) / (60 * clock.dt)

          if (mass.current >= neededMass && energy.current >= neededEnergy) {
            mass.current -= neededMass
            energy.current -= neededEnergy

            draft.mass += neededMass
            draft.energy += neededEnergy
            draft.percentage =
              (draft.energy / cost.energy) * 0.5 + (draft.mass / cost.mass) * 0.5
          }
        } else {
          // if completed, remove order
          Draft.delete(entity)
          orders.shift()
        }
      } else {
        // move closer
        orders.unshift({
          action: 'move',
          position: position.clone().add(
            orders.current.position
              .clone()
              .sub(position)
              .normalize()
              .multiplyScalar(distanceDiff),
          ),
        })
      }
    }
  }
}
