import { System, Entity, ComponentStorage } from '~/core'
import {
  ComponentVelocity,
  ComponentDestination,
  ComponentPosition,
  ComponentMobile,
} from '~/components'

/**
 * SystemFollowDestination is used to make entities follow their destinations.
 */
export class SystemFollowDestination extends System {
  static id = 'follow-destination'
  static query = {
    entities: false,
    components: [
      ComponentDestination,
      ComponentMobile,
      ComponentPosition,
      ComponentVelocity,
    ],
    resources: [],
  }

  public dispatch(
    _: Set<Entity>,
    components: [
      ComponentStorage<ComponentDestination>,
      ComponentStorage<ComponentMobile>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentVelocity>,
    ],
    [],
  ) {
    for (const [
      entity,
      [destination, mobile, position, velocity],
    ] of ComponentStorage.join(...components)) {
      // check if destination is reached
      const distance = destination.distanceToSquared(position)
      if (distance < 2) {
        components[0].delete(entity)
        velocity.set(0.0, 0.0)
        continue
      }

      const direction = destination
        .clone()
        .sub(position)
        .normalize()
        .multiplyScalar(mobile.speed)

      velocity.set(direction.x, direction.y)
    }
  }
}
