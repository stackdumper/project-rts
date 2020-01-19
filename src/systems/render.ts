import * as PIXI from 'pixi.js'
import { System, Core, Entity, CoreEvent } from '~/core'
import { ComponentGraphics, ComponentPosition, ComponentDimensions } from '~/components'
import { ResourceScene, ResourceAssets } from '~/resources'

/**
 * SystemRender is used to render game content into pixi.js scene.
 */
export class SystemRender extends System {
  private sprites = new Map<string, PIXI.Sprite>()

  // create event listeners
  public initialize(core: Core) {
    const { textures } = core.getResource(ResourceAssets)
    const { viewport } = core.getResource(ResourceScene)

    // on add entity
    core.events.addListener(CoreEvent.AddEntity, (entity: Entity) => {
      const graphics = entity.components.get(ComponentGraphics)
      if (!graphics) return

      const dimensions = entity.components.get(ComponentDimensions)
      if (!dimensions) return

      // create sprite
      const sprite = new PIXI.Sprite(textures[graphics.texture].texture)

      // adjust dimeinsions
      sprite.width = dimensions.width
      sprite.height = dimensions.height
      sprite.alpha = graphics.alpha
      sprite.anchor.set(0.5, 0.5)

      // add to viewport
      viewport.addChild(sprite)

      // save to map
      this.sprites.set(entity.id, sprite)
    })

    // on remove entity
    core.events.addListener(CoreEvent.RemoveEntity, (entity: Entity) => {
      const graphics = entity.components.get(ComponentGraphics)

      if (graphics) {
        const sprite = this.sprites.get(entity.id)!

        viewport.removeChild(sprite)

        this.sprites.delete(entity.id)
      }
    })
  }

  public update(core: Core) {
    const { app } = core.getResource(ResourceScene)

    // update entities
    for (const entity of core.entities.values()) {
      // skip if doesn't have graphics
      if (!entity.components.has(ComponentGraphics)) continue
      if (!entity.components.has(ComponentDimensions)) continue

      // sync positions
      const position = entity.components.get(ComponentPosition)
      if (position) {
        const sprite = this.sprites.get(entity.id)!

        sprite.position.x = position.x
        sprite.position.y = position.y
      }
    }

    // render scene
    app.render()
  }
}
