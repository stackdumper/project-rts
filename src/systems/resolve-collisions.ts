import { System, Entity, ComponentStorage } from '~/core'
import { ComponentPosition, ComponentMobile } from '~/components'
import { ResourceCollisions } from '~/resources'

/**
 * SystemResolveCollisions is responsible for resolving collisions between entities.
 */
export class SystemResolveCollisions extends System {
  static id = 'resolve-collisions'
  static query = {
    core: false,
    components: [ComponentPosition, ComponentMobile],
    resources: [ResourceCollisions],
  }

  public dispatch(
    _: never,
    [Position, Mobile]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentMobile>,
    ],
    [collisions]: [ResourceCollisions],
  ) {
    for (const [entity, [position, mobile]] of ComponentStorage.join(Position, Mobile)) {
      const collision = collisions.get(entity)
      if (collision && collision.length !== 0) {
        const targetPosition = Position.get(collision[0])

        if (targetPosition) {
          const distance = position.distanceTo(targetPosition)
          const normal = position
            .clone()
            .sub(targetPosition)
            .normalize()

          position.add(normal.divideScalar(distance).multiplyScalar(mobile.speed * 10))
        }
      }
    }
  }
}
