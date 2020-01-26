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
  static id = 'follow-destination'
  static query = {
    entities: false,
    components: [ComponentOrders, ComponentMobile, ComponentPosition, ComponentVelocity],
    resources: [],
  }

  public dispatch(
    _: Set<Entity>,
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
      if (!orders.current || orders.current.action !== 'move') continue

      // check if destination is reached
      const distance = orders.current.position.distanceToSquared(position)
      if (distance < 2) {
        velocity.set(0.0, 0.0)

        components[0].get(entity)!.shift()

        continue
      }

      const direction = orders.current.position
        .clone()
        .sub(position)
        .normalize()
        .multiplyScalar(mobile.speed)

      velocity.set(direction.x, direction.y)
    }
  }
}
