import { System, Core } from '~/core'

/**
 * SystemRender is used to render game content into pixi.js scene.
 */
export class SystemVelocity extends System {
  static id = 'render'

  public update(core: Core) {
    for (const entity of core.entities) {
      if (entity.components.velocity && entity.components.position) {
        entity.components.position[0] += entity.components.velocity[0]
        entity.components.position[1] += entity.components.velocity[1]
      }
    }
  }
}
