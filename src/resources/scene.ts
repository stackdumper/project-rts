import * as PIXI from 'pixi.js'
import { Resource } from '~/core'

export class ResourceScene extends Resource {
  static id = 'scene'

  public view = document.getElementById('root')! as HTMLCanvasElement
  public app = new PIXI.Application({
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    view: this.view,
    resizeTo: this.view,
    backgroundColor: 0x080808,
    powerPreference: 'high-performance',
  })
  public containers = {
    viewport: new PIXI.Container(),
    map: new PIXI.Container(),
    land: new PIXI.Container(),
    ground: new PIXI.Container(),
  }

  constructor() {
    super()

    // disable pixi.js banner in console
    PIXI.utils.skipHello()

    // make containers interactive
    this.app.stage.interactive = true
    this.containers.viewport.interactive = true

    // add containers to stage
    this.app.stage.addChild(this.containers.viewport)
    this.containers.viewport.addChild(this.containers.map)
    this.containers.viewport.addChild(this.containers.land)
    this.containers.viewport.addChild(this.containers.ground)

    // set scale mode to nearest for crisp and sharp textures
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  }
}
