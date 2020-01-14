import { System, Core } from '~/core'
import { ResourceScene, ResourceMap } from '~/resources'
import { Graphics } from 'pixi.js'

export class SystemRenderMap extends System {
  static id = 'render_map'

  public initialize(core: Core) {
    const { app } = core.getResource(ResourceScene) as ResourceScene
    const { map } = core.getResource(ResourceMap) as ResourceMap

    const tiles = new Graphics()

    for (let x = 0; x < map.tiles.length; x++) {
      for (let y = 0; y < map.tiles[x].length; y++) {
        const isResource = map.resources[x][y]
        const canTravel = !isResource && map.navigation[x][y]

        tiles
          .lineStyle(1, 0xffffff)
          .beginFill(isResource ? 0x00ff00 : canTravel ? 0x000000 : 0x808080)
          .drawRect(40 * x, 40 * y, 40, 40)
          .endFill()
      }
    }

    app.stage.addChild(tiles)
  }
}
