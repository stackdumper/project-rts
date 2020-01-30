import { Resource } from '~/core'

export class ResourceMap extends Resource {
  static id = 'map'

  public textures: number[][]
  public resources: number[][]
  public navigation: number[][]

  constructor(public width = 10, public height = 10) {
    super()

    this.textures = new Array(this.width)
      .fill(1)
      .map(() => new Array(this.height).fill(1))

    this.resources = new Array(this.width)
      .fill(0)
      .map(() => new Array(this.height).fill(0).map(() => Number(Math.random() >= 0.999)))

    this.navigation = new Array(this.width)
      .fill(0)
      .map(() => new Array(this.height).fill(0).map(() => Number(Math.random() >= 0.98)))
  }
}
