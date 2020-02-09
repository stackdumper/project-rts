import { Component } from '~/core'
import { ResourceTextures } from '~/resources'

export class ComponentTexture extends Component {
  static id = 'texture'

  constructor(
    public texture: keyof typeof ResourceTextures.graphics,
    public scale = 1,
    public alpha = 1,
  ) {
    super()
  }
}
