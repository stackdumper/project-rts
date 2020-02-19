import { System, Entity, ComponentStorage } from '~/core'
import { ComponentPosition, ComponentMobile, ComponentProjectile } from '~/components'
import { ResourceCollisions } from '~/resources'

/**
 * SystemResolveCollisions is responsible for resolving collisions between entities.
 */
export class SystemResolveCollisions extends System {
  static id = 'resolve-collisions'
  static query = {
    core: false,
    components: [ComponentPosition, ComponentMobile, ComponentProjectile],
    resources: [ResourceCollisions],
  }

  public dispatch(
    _: never,
    [Position, Mobile, Projectile]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentMobile>,
      ComponentStorage<ComponentProjectile>,
    ],
    [collisions]: [ResourceCollisions],
  ) {
    for (const [entity, [position, mobile]] of ComponentStorage.join(Position, Mobile)) {
      // skip for projectile
      if (Projectile.has(entity)) continue

      const collided = collisions.get(entity)
      if (collided && collided.length !== 0) {
        for (const collision of collided) {
          // skip for projectile
          if (Projectile.has(collision)) continue

          const targetPosition = Position.get(collision)

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
}
