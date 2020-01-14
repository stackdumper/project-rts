import { Graphics } from 'pixi.js'
import { Resource } from '~/core'

interface Tile {
  x: number
  y: number
  resource: boolean
  canTravel: boolean
}

interface MapSettings {
  width: number
  heidth: number
  tileSize: number
}

const mapSettings: MapSettings = {
  width: 10,
  heidth: 10,
  tileSize: 40,
}

const createTiles = ({ width, heidth, tileSize }: MapSettings): Tile[] => {
  const tiles: Tile[] = []

  for (let x = 0; x < new Array(width).length; x++) {
    for (let y = 0; y < new Array(heidth).length; y++) {
      tiles.push({
        x: 120 + tileSize * x,
        y: 120 + tileSize * y,
        resource: Math.random() >= 0.96,
        canTravel: true,
      })
    }
  }

  return tiles
}

export class ResourceMap extends Resource {
  public tiles: Graphics[]

  constructor() {
    super()

    this.tiles = createTiles(mapSettings).map((tile) =>
      this.createTile(tile.x, tile.y, tile.resource, mapSettings.tileSize),
    )
  }

  private createTile(x: number, y: number, resource: boolean, tileSize: number) {
    return new Graphics()
      .lineStyle(1, 0xffffff)
      .beginFill(resource ? 0x00ff00 : 0x000000)
      .drawRect(x, y, tileSize, tileSize)
      .endFill()
  }
}
