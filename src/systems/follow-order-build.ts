import { System, ComponentStorage, Core } from '~/core'
import {
  ComponentPosition,
  ComponentOrders,
  ComponentEngineering,
  ComponentDraft,
  ComponentVelocity,
} from '~/components'
import { ResourceResources, ResourceClock } from '~/resources'

/**
 * SystemFollowOrderMove is responsible for making entities follor move order.
 */
export class SystemFollowOrderBuild extends System {
  static id = 'follow-order-build'
  static query = {
    core: true,
    components: [
      ComponentOrders,
      ComponentPosition,
      ComponentEngineering,
      ComponentVelocity,
      ComponentDraft,
    ],
    resources: [ResourceClock, ResourceResources],
  }

  public dispatch(
    core: Core,
    [Orders, Position, Engineering, Velocity, Draft]: [
      ComponentStorage<ComponentOrders>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentEngineering>,
      ComponentStorage<ComponentVelocity>,
      ComponentStorage<ComponentDraft>,
    ],
    [clock, resources]: [ResourceClock, ResourceResources],
  ) {
    for (const [e, [orders, position, engineering]] of ComponentStorage.join(
      Orders,
      Position,
      Engineering,
    )) {
      if (!orders.current || orders.current.action !== 'construct') continue

      const distanceDiff =
        position.distanceTo(orders.current.position) - engineering.range

      // if in range, build
      // else, add move closer order
      if (distanceDiff < 5) {
        Velocity.get(e)!.set(0.0, 0.0)

        const { template, entity, position, playerID } = orders.current

        if (!entity) {
          // set position to ordered
          template.getComponent(ComponentPosition).set(position.x, position.y)

          // add entity
          const constructionEntity = core.addEntity(template.build(playerID))

          // set entity
          orders.shift()
          orders.unshift({
            action: 'construct',
            position: Position.get(constructionEntity)!,
            entity: constructionEntity,
            playerID,
            template,
          })
        } else if (entity) {
          const draft = Draft.get(entity)!

          if (draft.mass < draft.totalMass || draft.energy < draft.totalEnergy) {
            const neededMass =
              draft.totalMass / (draft.time / engineering.rate) / (60 * clock.dt)
            const neededEnergy =
              draft.totalEnergy / (draft.time / engineering.rate) / (60 * clock.dt)

            if (
              resources.mass.current >= neededMass &&
              resources.energy.current >= neededEnergy
            ) {
              resources.mass.current -= neededMass
              resources.energy.current -= neededEnergy

              draft.mass += neededMass
              draft.energy += neededEnergy
            }
          } else {
            Draft.delete(entity)
            orders.shift()
          }
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
