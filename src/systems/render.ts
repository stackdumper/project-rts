import * as PIXI from 'pixi.js'
import { System, Core, Entity, CoreEvent } from '~/core'
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
  private container: PIXI.Container

  constructor(options: SystemRenderOptions) {
    super()

    // disable pixi.js banner in console
    PIXI.utils.skipHello()

    // create new app instance
    this.app = new PIXI.Application({
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      view: options.view,
      resizeTo: options.view,
      backgroundColor: 0x080808,
      powerPreference: 'high-performance',
    })

    // create entity container
    this.container = new PIXI.Container()

    // add entity container to stage
    this.app.stage.addChild(this.container)

    // set scale mode to nearest for crisp and sharp textures
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  }

  // create event listeners
  public initialize(core: Core) {

    // on add entity
    core.events.addListener(CoreEvent.AddEntity, (entity: Entity) => {
      const graphics = entity.components.get(ComponentGraphics.name) as ComponentGraphics

      if (graphics) {
        this.container.addChild(graphics.sprite)
      }
    })

    // on remove entity
    core.events.addListener(CoreEvent.RemoveEntity, (entity: Entity) => {
      const graphics = entity.components.get(ComponentGraphics.name) as ComponentGraphics

      if (graphics) {
        this.container.removeChild(graphics.sprite)
      }
    })
  }

  public update(core: Core) {
    // update entities
    for (const entity of core.entities.values()) {
      const graphics = entity.components.get(ComponentGraphics.name) as ComponentGraphics
      const position = entity.components.get(ComponentPosition.name) as ComponentPosition

      if (graphics && position) {
        graphics.sprite.position.x = position.x
        graphics.sprite.position.y = position.y
      }
    }

    // render scene
    this.app.render()
  }
}
