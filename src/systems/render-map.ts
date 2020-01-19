import { Graphics } from 'pixi.js'
import { System, Core } from '~/core'
import { ResourceScene, ResourceMap } from '~/resources'

/**
 * SystemRenderMap is responsible for rendering game map.
 */
export class SystemRenderMap extends System {
  private tileSize = 16
  private colors = {
    texture: 0x222f3e,
    navigation: 0x576574,
    resource: 0x1dd1a1,
  }

  public initialize(core: Core) {
    const { viewport } = core.getResource(ResourceScene) as ResourceScene
    const { map } = core.getResource(ResourceMap) as ResourceMap

    const tiles = new Graphics()

    for (let x = 0; x < map.textures.length; x++) {
      for (let y = 0; y < map.textures[x].length; y++) {
        const tile = map.textures[x][y]
        const navigation = map.navigation[x][y]
        const resource = map.resources[x][y]

        const color =
          (resource && this.colors.resource) ||
          (navigation && this.colors.navigation) ||
          (tile && this.colors.texture)

        tiles
          .beginFill(color)
          .drawRect(this.tileSize * x, this.tileSize * y, this.tileSize, this.tileSize)
          .endFill()
      }
    }

    viewport.addChild(tiles)
  }
}
