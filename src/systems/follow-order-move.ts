import { System, Entity, ComponentStorage } from '~/core'
import {
  ComponentVelocity,
  ComponentPosition,
  ComponentMobile,
  ComponentOrders,
} from '~/components'

/**
 * SystemFollowOrderMove is responsible for making entities follor move order.
 */
export class SystemFollowOrderMove extends System {
  static id = 'follow-order-move'
  static query = {
    core: false,
    components: [ComponentOrders, ComponentMobile, ComponentPosition, ComponentVelocity],
    resources: [],
  }

  public dispatch(
    _: never,
    components: [
      ComponentStorage<ComponentOrders>,
      ComponentStorage<ComponentMobile>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentVelocity>,
    ],
    [],
  ) {
    for (const [entity, [orders, mobile, position, velocity]] of ComponentStorage.join(
      ...components,
    )) {
      if (orders.current && orders.current.action === 'move') {
        const distance = orders.current.position.distanceToSquared(position)

        if (distance > 2) {
          const direction = orders.current.position
            .clone()
            .sub(position)
            .normalize()
            .multiplyScalar(mobile.speed)

          velocity.set(direction.x, direction.y)
        } else {
          velocity.set(0.0, 0.0)

          components[0].get(entity)!.shift()
        }
      }
    }
  }
}
