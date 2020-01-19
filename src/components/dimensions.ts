import { Component } from '~/core'
import { Vector2 } from '~/math'

export class ComponentDimensions extends Component {
  public min: Vector2
  public max: Vector2

  constructor(public width: number, public height: number) {
    super()

    this.min = new Vector2(-width / 2, -height / 2)
    this.max = new Vector2(width / 2, height / 2)
  }
}
