import { Component } from '~/core'
import { ResourceAssets } from '~/resources'

export class ComponentGraphics extends Component {
  constructor(
    public texture: keyof ResourceAssets['textures'],
    public alpha: number = 1,
  ) {
    super()
  }
}
