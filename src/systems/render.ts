import { System, Core, Entity } from '~/core'
import * as PIXI from 'pixi.js'

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
      if (entity.components.graphics) {
        this.app.stage.addChild(entity.components.graphics)
      }
    })

    // on remove entity
    core.events.addListener('remove-entity', (entity: Entity) => {
      if (entity.components.graphics) {
        this.app.stage.removeChild(entity.components.graphics)
      }
    })
  }

  public update(core: Core) {
    // update entities
    for (const entity of core.entities) {
      if (entity.components.graphics && entity.components.position) {
        entity.components.graphics.position.x = entity.components.position[0]
        entity.components.graphics.position.y = entity.components.position[1]
      }
    }

    // render scene
    this.app.render()
  }
}
