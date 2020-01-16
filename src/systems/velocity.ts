import { System, Core } from '~/core'
import { ResourceClock } from '~/resources'
import { ComponentPosition, ComponentVelocity } from '~/components'

/**
 * SystemVelocity is used to apply velocities to entities positions.
 */
export class SystemVelocity extends System {
  public update(core: Core) {
    for (const entity of core.entities.values()) {
      // how to avoid 'as'?
      const clock = core.getResource(ResourceClock) as ResourceClock

      const position = entity.components.get(ComponentPosition) as ComponentPosition
      const velocity = entity.components.get(ComponentVelocity) as ComponentVelocity

      if (position && velocity) {
        position.x += velocity.x * clock.dt
        position.y += velocity.y * clock.dt
      }
    }
  }
}
