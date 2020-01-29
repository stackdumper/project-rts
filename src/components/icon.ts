import { Component } from '~/core'
import { ResourceIcons } from '~/resources'

export class ComponentIcon extends Component {
  static id = 'icon'

  constructor(public icon: keyof typeof ResourceIcons.graphics, public scale = 1) {
    super()
  }
}
