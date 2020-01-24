import * as PIXI from 'pixi.js'
import { Resource } from '~/core'

export class ResourceScene extends Resource {
  static id = 'scene'

  public view = document.getElementById('root')! as HTMLCanvasElement
  public app: PIXI.Application
  public viewport: PIXI.Container

  constructor() {
    super()

    // disable pixi.js banner in console
    PIXI.utils.skipHello()

    // create new app instance
    this.app = new PIXI.Application({
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      view: this.view,
      resizeTo: this.view,
      backgroundColor: 0x080808,
      powerPreference: 'high-performance',
    })

    // create new viewport instance
    this.viewport = new PIXI.Container()
    this.viewport.interactive = true
    this.viewport.interactiveChildren = true

    // add viewport to stage
    this.app.stage.addChild(this.viewport)
    this.app.stage.interactive = true
    this.app.stage.interactiveChildren = true

    // set scale mode to nearest for crisp and sharp textures
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  }
}
