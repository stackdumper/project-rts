import * as PIXI from 'pixi.js'
import { System, Core } from '~/core'
import { ResourceScene, ResourceMap } from '~/resources'

/**
 * SystemRenderMap is responsible for rendering game map.
 */
export class SystemRenderMap extends System {
  static id = 'render-map'

  private tileSize = 16
  private chunkSize = 64
  private colors = {
    texture: 0x192129,
    navigation: 0x2c3a47,
    resource: 0x58b19f,
  }

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)
    const map = core.getResource(ResourceMap)

    for (let chunkX = 0; chunkX < map.width / this.chunkSize; chunkX++) {
      for (let chunkY = 0; chunkY < map.height / this.chunkSize; chunkY++) {
        const graphics = new PIXI.Graphics()

        for (let x = 0; x < this.chunkSize; x++) {
          for (let y = 0; y < this.chunkSize; y++) {
            const fx = chunkX * this.chunkSize + x
            const fy = chunkY * this.chunkSize + y

            const color =
              (map.resources[fx][fy] && this.colors.resource) ||
              (map.navigation[fx][fy] && this.colors.navigation) ||
              (map.textures[fx][fy] && this.colors.texture)

            graphics
              .beginFill(color)
              .drawRect(
                this.tileSize * x,
                this.tileSize * y,
                this.tileSize,
                this.tileSize,
              )
          }
        }

        const sprite = new PIXI.Sprite(
          scene.app.renderer.generateTexture(
            graphics.endFill(),
            PIXI.SCALE_MODES.NEAREST,
            0.25,
          ),
        )
        sprite.position.set(
          chunkX * this.chunkSize * this.tileSize,
          chunkY * this.chunkSize * this.tileSize,
        )
        sprite.cacheAsBitmap = true
        scene.containers.map.addChild(sprite)
      }
    }
  }
}
