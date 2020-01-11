import * as PIXI from 'pixi.js'
import { System, Core, Entity } from '~/core'
import { ComponentGraphics, ComponentPosition } from '~/components'

interface SystemRenderOptions {
  view: HTMLCanvasElement
}

/**
 * SystemRender is used to render game content into pixi.js scene.
 */
export class SystemRender extends System {
  static id = 'render'

  private app: PIXI.Application

  constructor(options: SystemRenderOptions) {
    super()

    // disable pixi.js banner in console
    PIXI.utils.skipHello()

    // create new app instance
    this.app = new PIXI.Application({
      width: 256,
      height: 256,
      antialias: false,
      resolution: 1,
      view: options.view,
      resizeTo: options.view,
    })
  }

  // create event listeners
  public initialize(core: Core) {
    // on add entity
    core.events.addListener('add-entity', (entity: Entity) => {
      const graphics = entity.components.get(ComponentGraphics.name) as ComponentGraphics

      if (graphics) {
        this.app.stage.addChild(graphics.graphics)
      }
    })

    // on remove entity
    core.events.addListener('remove-entity', (entity: Entity) => {
      const graphics = entity.components.get(ComponentGraphics.name) as ComponentGraphics

      if (graphics) {
        this.app.stage.removeChild(graphics.graphics)
      }
    })
  }

  public update(core: Core) {
    // update entities
    for (const entity of core.entities.values()) {
      const graphics = entity.components.get(ComponentGraphics.name) as ComponentGraphics
      const position = entity.components.get(ComponentPosition.name) as ComponentPosition

      if (graphics && position) {
        graphics.graphics.position.x = position.x
        graphics.graphics.position.y = position.y
      }
    }

    // render scene
    this.app.render()
  }
}
