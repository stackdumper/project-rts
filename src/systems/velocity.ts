import { System, Core } from '~/core'
import { ResourceClock } from '~/resources'
import { ComponentPosition, ComponentVelocity } from '~/components'

/**
 * SystemVelocity is used to apply velocities to entities positions.
 */
export class SystemVelocity extends System {
  public update(core: Core) {
    const clock = core.getResource(ResourceClock) as ResourceClock

    for (const entity of core.entities.values()) {
      const position = entity.components.get(ComponentPosition) as ComponentPosition
      if (!position) continue

      const velocity = entity.components.get(ComponentVelocity) as ComponentVelocity
      if (!velocity) continue

      position.x += velocity.x * clock.dt
      position.y += velocity.y * clock.dt
    }
  }
}
