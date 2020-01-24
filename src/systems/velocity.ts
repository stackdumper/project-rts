import { System, Entity, ComponentStorage } from '~/core'
import { ComponentPosition, ComponentVelocity } from '~/components'
import { ResourceClock } from '~/resources'

/**
 * SystemVelocity is used to apply velocities to entities positions.
 */
export class SystemVelocity extends System {
  static id = 'velocity'
  static query = {
    entities: true,
    components: [ComponentPosition, ComponentVelocity],
    resources: [ResourceClock],
  }

  public dispatch(
    _: Set<Entity>,
    [pos, vel]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentVelocity>,
    ],
    [clock]: [ResourceClock],
  ) {
    for (const [position, velocity] of ComponentStorage.join(pos, vel).values()) {
      position.x += velocity.x * clock.dt
      position.y += velocity.y * clock.dt
    }
  }
}
