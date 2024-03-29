import * as PIXI from 'pixi.js'
import { Resource, Core } from '~/core'
import { ResourceScene } from './scene'

export class ResourceTextures
  extends Map<keyof typeof ResourceTextures.graphics, PIXI.Texture>
  implements Resource {
  static id = 'textures'

  static graphics = {
    // land: new PIXI.Graphics()
    //   .beginFill(0xffffff, 0.3)
    //   .lineStyle(1, 0xffffff, 0.8)
    //   .moveTo(0, 6)
    //   .lineTo(6, 0)
    //   .lineTo(12, 6)
    //   .lineTo(6, 12)
    //   .lineTo(0, 6)
    //   .endFill(),

    land: new PIXI.Graphics()
      .beginFill(0xffffff, 0.2)
      .lineStyle(4, 0xffffff, 0.5)
      .drawCircle(0, 0, 16)
      .endFill(),

    ground: new PIXI.Graphics()
      .beginFill(0xffffff, 0.2)
      .lineStyle(2, 0xffffff, 0.5)
      .drawRect(0, 0, 32, 32)
      .endFill(),

    healthBar: new PIXI.Graphics()
      .beginFill(0x55e6c1)
      .drawRect(0, 0, 32, 2)
      .endFill(),

    progressBar: new PIXI.Graphics()
      .beginFill(0x1b9cfc)
      .drawRect(0, 0, 32, 2)
      .endFill(),

    projectile: new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, 1, 1)
      .endFill(),
  }

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)

    for (const [key, value] of Object.entries(ResourceTextures.graphics)) {
      this.set(
        // @ts-ignore
        key,
        scene.app.renderer.generateTexture(
          value,
          PIXI.SCALE_MODES.NEAREST,
          window.devicePixelRatio,
        ),
      )
    }
  }
}
