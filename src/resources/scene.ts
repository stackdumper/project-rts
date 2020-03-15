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
    icons: new PIXI.Container(),
    health: new PIXI.ParticleContainer(4096, { vertices: true }),
    progress: new PIXI.ParticleContainer(4096, { vertices: true, tint: true }),
    map: new PIXI.Container(),
    land: new PIXI.ParticleContainer(4096, { tint: true }),
    ground: new PIXI.ParticleContainer(4096, { tint: true }),
    projectile: new PIXI.ParticleContainer(4096),
  }

  constructor() {
    super()

    // disable pixi.js banner in console
    PIXI.utils.skipHello()

    // make containers interactive
    this.app.stage.interactive = true
    this.containers.viewport.interactive = true

    // add containers to stage

    this.containers.viewport.addChild(this.containers.map)
    this.containers.viewport.addChild(this.containers.land)
    this.containers.viewport.addChild(this.containers.ground)
    this.containers.viewport.addChild(this.containers.projectile)
    this.containers.viewport.addChild(this.containers.health)
    this.containers.viewport.addChild(this.containers.progress)
    this.app.stage.addChild(this.containers.viewport)
    this.app.stage.addChild(this.containers.icons)

    // set scale mode to nearest for crisp and sharp textures
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
  }
}
