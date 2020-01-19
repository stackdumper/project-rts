import * as PIXI from 'pixi.js'
import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace'
import { System, Core, Entity, CoreEvent } from '~/core'
import {
  ComponentGraphics,
  ComponentPosition,
  ComponentDimensions,
  ComponentOwnership,
} from '~/components'
import { ResourceScene, ResourceAssets } from '~/resources'

/**
 * SystemRenderEntities is used to render game content into pixi.js scene.
 */
export class SystemRenderEntities extends System {
  private containers = new Map<number, PIXI.Container>()
  private sprites = new Map<string, PIXI.Sprite>()
  private colors = [0xffffff, 0x1b9cfc, 0xfc427b]

  // create event listeners
  public initialize(core: Core) {
    const { textures } = core.getResource(ResourceAssets)
    const { viewport } = core.getResource(ResourceScene)

    // on add entity
    core.events.addListener(CoreEvent.AddEntity, (entity: Entity) => {
      const ownership = entity.components.get(ComponentOwnership)
      if (!ownership) return

      // add container for this player if not exists
      let container = this.containers.get(ownership.playerID)
      if (!container) {
        container = new PIXI.Container()
        container.filters = [
          new MultiColorReplaceFilter([
            [this.colors[0], this.colors[ownership.playerID]],
          ]),
        ]
        viewport.addChild(container)
        this.containers.set(ownership.playerID, container)
      }

      const graphics = entity.components.get(ComponentGraphics)
      if (!graphics) return

      const dimensions = entity.components.get(ComponentDimensions)
      if (!dimensions) return

      // create sprite
      const sprite = new PIXI.Sprite(textures[graphics.texture].texture)

      // adjust params
      sprite.width = dimensions.width
      sprite.height = dimensions.height
      sprite.alpha = graphics.options.alpha
      sprite.scale.x *= graphics.options.scale
      sprite.scale.y *= graphics.options.scale
      sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES[graphics.options.scaleMode]
      sprite.texture.baseTexture.resolution = graphics.options.resolution
      sprite.rotation = graphics.options.rotation
      sprite.anchor.set(0.5, 0.5)

      // add to viewport
      container.addChild(sprite)

      // save to map
      this.sprites.set(entity.id, sprite)
    })

    // on remove entity
    core.events.addListener(CoreEvent.RemoveEntity, (entity: Entity) => {
      const graphics = entity.components.get(ComponentGraphics)
      if (!graphics) return

      const ownership = entity.components.get(ComponentOwnership)
      if (!ownership) return

      const container = this.containers.get(ownership.playerID)!
      const sprite = this.sprites.get(entity.id)!

      container.removeChild(sprite)
      this.sprites.delete(entity.id)
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
