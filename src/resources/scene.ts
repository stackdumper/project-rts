import * as PIXI from 'pixi.js'
import { Resource } from '~/core'

export class ResourceScene extends Resource {
  public app: PIXI.Application

  private container = document.getElementById('root')! as HTMLCanvasElement

  constructor() {
    super()

    // disable pixi.js banner in console
    PIXI.utils.skipHello()

    // create new app instance
    this.app = new PIXI.Application({
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      view: this.container,
      resizeTo: this.container,
      backgroundColor: 0x080808,
      powerPreference: 'high-performance',
    })

    // set scale mode to nearest for crisp and sharp textures
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  }
}
