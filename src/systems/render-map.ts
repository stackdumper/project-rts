import { System, Core } from '~/core'
import { ResourceScene, ResourceMap } from '~/resources'
import { Graphics } from 'pixi.js'

export class SystemRenderMap extends System {
  private colors = {
    tile: 0x222f3e,
    navigation: 0x576574,
    resource: 0x1dd1a1,
  }

  public initialize(core: Core) {
    const { app } = core.getResource(ResourceScene) as ResourceScene
    const { map } = core.getResource(ResourceMap) as ResourceMap

    const tiles = new Graphics()

    for (let x = 0; x < map.tiles.length; x++) {
      for (let y = 0; y < map.tiles[x].length; y++) {
        const tile = map.tiles[x][y]
        const navigation = map.navigation[x][y]
        const resource = map.resources[x][y]

        const color =
          (resource && this.colors.resource) ||
          (navigation && this.colors.navigation) ||
          (tile && this.colors.tile)

        tiles
          .beginFill(color)
          .drawRect(16 * x, 16 * y, 16, 16)
          .endFill()
      }
    }

    app.stage.addChild(tiles)
  }
}
