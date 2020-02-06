import { Component } from '~/core'

export class ComponentHealth extends Component {
  static id = 'health'

  public max: number
  public current: number

  constructor(max: number = 1000) {
    super()

    this.max = max
    this.current = max
  }
}
