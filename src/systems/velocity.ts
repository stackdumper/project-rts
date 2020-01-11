import { System, Core } from '~/core'
import { ResourceClock } from '~/resources'

/**
 * SystemRender is used to render game content into pixi.js scene.
 */
export class SystemVelocity extends System {
  static id = 'velocity'

  public update(core: Core) {
    for (const entity of core.entities.values()) {
      // how to avoid 'as'?
      const clock = core.getResource(ResourceClock) as ResourceClock

      if (entity.components.velocity && entity.components.position) {
        entity.components.position[0] += entity.components.velocity[0] * clock.dt
        entity.components.position[1] += entity.components.velocity[1] * clock.dt
      }
    }
  }
}
