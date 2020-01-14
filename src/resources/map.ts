import { Resource } from '~/core'

interface IMap {
  tiles: number[][]
  resources: number[][]
  navigation: number[][]
}

export class ResourceMap extends Resource {
  public map: IMap

  constructor(private width = 10, private height = 10) {
    super()

    this.map = {
      tiles: new Array(this.width).fill(0).map(() => new Array(this.height).fill(0)),
      resources: new Array(this.width)
        .fill(0)
        .map(() =>
          new Array(this.height).fill(0).map(() => Number(Math.random() >= 0.95)),
        ),
      navigation: new Array(this.width)
        .fill(0)
        .map(() =>
          new Array(this.height).fill(0).map(() => Number(Math.random() <= 0.95)),
        ),
    }
  }
}
