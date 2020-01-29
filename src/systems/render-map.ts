import * as PIXI from 'pixi.js'
import { System, Core } from '~/core'
import { ResourceScene, ResourceMap } from '~/resources'

/**
 * SystemRenderMap is responsible for rendering game map.
 */
export class SystemRenderMap extends System {
  static id = 'render-map'

  private tileSize = 16
  private colors = {
    texture: 0x222f3e,
    navigation: 0x576574,
    resource: 0x1dd1a1,
  }

  public initialize(core: Core) {
    const { app, containers } = core.getResource(ResourceScene)
    const { textures, navigation, resources } = core.getResource(ResourceMap).map

    const graphics = new PIXI.Graphics()
    for (let x = 0; x < textures.length; x++) {
      for (let y = 0; y < textures[x].length; y++) {
        const color =
          (resources[x][y] && this.colors.resource) ||
          (navigation[x][y] && this.colors.navigation) ||
          (textures[x][y] && this.colors.texture)

        graphics
          .beginFill(color)
          .drawRect(this.tileSize * x, this.tileSize * y, this.tileSize, this.tileSize)
          .endFill()
      }
    }

    const sprite = new PIXI.Sprite(
      app.renderer.generateTexture(graphics, PIXI.SCALE_MODES.NEAREST, 1),
    )

    sprite.cacheAsBitmap = true
    containers.map.addChild(sprite)
  }
}
