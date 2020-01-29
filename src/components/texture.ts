import { Component } from '~/core'
import { ResourceAssets } from '~/resources'

export class ComponentTexture extends Component {
  static id = 'texture'

  constructor(public texture: keyof ResourceAssets['textures']) {
    super()
  }
}
