import { Component } from '~/core'
import { ResourceAssets } from '~/resources'

interface ComponentGraphicsOptions {
  alpha: number
  scale: number
  scaleMode: 'NEAREST' | 'LINEAR'
  resolution: number
  rotation: number
}

export class ComponentGraphics extends Component {
  static id = 'graphics'

  public texture: keyof ResourceAssets['textures']
  public options: ComponentGraphicsOptions

  constructor(
    texture: keyof ResourceAssets['textures'],
    options: Partial<ComponentGraphicsOptions> = {},
  ) {
    super()

    this.texture = texture
    this.options = Object.assign(
      {
        alpha: 1,
        scale: 1,
        scaleMode: 'NEAREST',
        resolution: 1,
        rotation: 0,
      } as ComponentGraphicsOptions,
      options,
    )
  }
}
