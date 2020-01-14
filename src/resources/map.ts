import { Resource } from '~/core'

interface IMap {
  textures: number[][]
  resources: number[][]
  navigation: number[][]
}

export class ResourceMap extends Resource {
  public map: IMap

  constructor(public width = 10, public height = 10) {
    super()

    this.map = {
      textures: new Array(width).fill(0).map(() => new Array(height).fill(0)),
      resources: new Array(width)
        .fill(0)
        .map(() => new Array(height).fill(0).map(() => Number(Math.random() >= 0.95))),
      navigation: new Array(width)
        .fill(0)
        .map(() => new Array(height).fill(0).map(() => Number(Math.random() <= 0.95))),
    }
  }
}
