import { Component } from '~/core'
import { ResourceAssets } from '~/resources'

export class ComponentIcon extends Component {
  static id = 'icon'

  constructor(public texture: keyof ResourceAssets['textures']) {
    super()
  }
}
