import { Resource } from '~/core'
import { Graphics } from 'pixi.js'

interface IMap {
  tiles: number[][]
  resources: number[][]
  canTravel: number[][]
}

const map: IMap = {
  tiles: new Array(10).fill(0).map(() => new Array(10).fill(0)),
  resources: new Array(10)
    .fill(0)
    .map(() => new Array(10).fill(0).map(() => Number(Math.random() >= 0.95))),
  canTravel: new Array(10)
    .fill(0)
    .map(() => new Array(10).fill(0).map(() => Number(Math.random() <= 0.95))),
}

export class ResourceMap extends Resource {
  public tiles: Graphics

  constructor() {
    super()

    this.tiles = new Graphics()

    for (let x = 0; x < map.tiles.length; x++) {
      for (let y = 0; y < map.tiles[x].length; y++) {
        const isResource = map.resources[x][y]
        const canTravel = !isResource && map.canTravel[x][y]

        this.tiles
          .lineStyle(1, 0xffffff)
          .beginFill(isResource ? 0x00ff00 : canTravel ? 0x000000 : 0x808080)
          .drawRect(40 * x, 40 * y, 40, 40)
          .endFill()
      }
    }
  }
}
