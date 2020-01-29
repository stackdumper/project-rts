import * as PIXI from 'pixi.js'
import { Resource, Core } from '~/core'
import { ResourceScene } from './scene'

export class ResourceIcons extends Map<keyof typeof ResourceIcons.graphics, PIXI.Texture>
  implements Resource {
  static id = 'icons'

  static graphics = {
    commander: new PIXI.Graphics()
      .beginFill(0xffffff, 1)
      .lineStyle(1, 0x000000)
      .moveTo(0, 6) // rotated square
      .lineTo(6, 0)
      .lineTo(12, 6)
      .lineTo(6, 12)
      .lineTo(0, 6)
      .endFill()
      .lineStyle(1, 0x000000) // m in center
      .moveTo(3, 4)
      .lineTo(3, 7)
      .moveTo(6, 4)
      .lineTo(6, 7)
      .moveTo(9, 4)
      .lineTo(9, 7)
      .moveTo(3, 5)
      .lineTo(10, 5)
      .endFill(),
  }

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)

    for (const [key, value] of Object.entries(ResourceIcons.graphics)) {
      this.set(
        // @ts-ignore
        key,
        scene.app.renderer.generateTexture(value, PIXI.SCALE_MODES.NEAREST, 1),
      )
    }
  }
}
