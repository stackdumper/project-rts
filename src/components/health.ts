import { Component } from '~/core'

export class ComponentHealth extends Component {
  public health: number

  constructor(public maxHealth: number) {
    super()

    this.health = this.maxHealth
  }
}
