import { System, Entity, ComponentStorage } from '~/core'
import {
  ComponentPosition,
  ComponentMobile,
  ComponentProjectile,
  ComponentRigid,
  ComponentDimensions,
} from '~/components'
import { ResourceCollisions } from '~/resources'
import { Vector2 } from 'three/src/math/Vector2'

/**
 * SystemResolveCollisions is responsible for resolving collisions between entities.
 */
export class SystemResolveCollisions extends System {
  static id = 'resolve-collisions'
  static query = {
    core: false,
    components: [ComponentMobile, ComponentRigid, ComponentPosition, ComponentDimensions],
    resources: [ResourceCollisions],
  }

  public dispatch(
    _: never,
    [Mobile, Rigid, Position, Dimensions]: [
      ComponentStorage<ComponentMobile>,
      ComponentStorage<ComponentRigid>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
    ],
    [collisions]: [ResourceCollisions],
  ) {
    const sources = ComponentStorage.join(Mobile, Rigid, Position, Dimensions)
    const targets = ComponentStorage.join(Rigid, Position, Dimensions)

    for (const [entity, [_mobile, _rigid, position, dimensions]] of sources) {
      const collided = collisions.get(entity)

      // resolve each collision
      for (const collision of collided || []) {
        // get target components
        const [_rigid, targetPosition, targetDimensions] = targets.get(collision) || []

        // resolve if has eligible
        if (targetPosition && targetDimensions) {
          const distance = position.distanceTo(targetPosition)
          const penetration = Math.abs(
            distance - (dimensions.width / 2 + targetDimensions.width / 2),
          )

          const normal = position
            .clone()
            .sub(targetPosition)
            .add(new Vector2((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10))
            .normalize()

          position.add(normal.multiplyScalar(penetration * 0.003).multiplyScalar(6))
        }
      }
    }
  }
}
