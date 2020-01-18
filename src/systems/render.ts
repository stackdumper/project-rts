import { System, Core, Entity, CoreEvent } from '~/core'
import { ComponentGraphics, ComponentPosition } from '~/components'
import { ResourceScene } from '~/resources'

/**
 * SystemRender is used to render game content into pixi.js scene.
 */
export class SystemRender extends System {
  // create event listeners
  public initialize(core: Core) {
    const { viewport } = core.getResource(ResourceScene) as ResourceScene

    // on add entity
    core.events.addListener(CoreEvent.AddEntity, (entity: Entity) => {
      const graphics = entity.components.get(ComponentGraphics) as ComponentGraphics

      if (graphics) {
        viewport.addChild(graphics.sprite)
      }
    })

    // on remove entity
    core.events.addListener(CoreEvent.RemoveEntity, (entity: Entity) => {
      const graphics = entity.components.get(ComponentGraphics) as ComponentGraphics

      if (graphics) {
        viewport.removeChild(graphics.sprite)
      }
    })
  }

  public update(core: Core) {
    const { app } = core.getResource(ResourceScene) as ResourceScene

    // update entities
    for (const entity of core.entities.values()) {
      const graphics = entity.components.get(ComponentGraphics) as ComponentGraphics
      const position = entity.components.get(ComponentPosition) as ComponentPosition

      if (graphics && position) {
        graphics.sprite.position.x = position.x
        graphics.sprite.position.y = position.y
      }
    }

    // render scene
    app.render()
  }
}
