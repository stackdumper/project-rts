import { Graphics } from 'pixi.js'
import { System, Core } from '~/core'
import { ResourceScene, ResourceMap } from '~/resources'

export class SystemRenderMap extends System {
  private tileSize = 10

  public initialize(core: Core) {
    const { app } = core.getResource(ResourceScene) as ResourceScene
    const resourceMap = core.getResource(ResourceMap) as ResourceMap

    const textures = new Graphics()

    for (let x = 0; x < resourceMap.width; x++) {
      for (let y = 0; y < resourceMap.height; y++) {
        const isResource = resourceMap.map.resources[x][y]
        const canTravel = !isResource && resourceMap.map.navigation[x][y]

        textures
          .lineStyle(1, 0xffffff)
          .beginFill(isResource ? 0x00ff00 : canTravel ? 0x000000 : 0x808080)
          .drawRect(this.tileSize * x, this.tileSize * y, this.tileSize, this.tileSize)
          .endFill()
      }
    }

    app.stage.addChild(textures)
  }
}
