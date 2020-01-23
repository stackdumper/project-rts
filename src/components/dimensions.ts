import { Component } from '~/core'
import { Vector2 } from '~/math'

export class ComponentDimensions implements Component {
  static id = 'dimensions'

  public min: Vector2
  public max: Vector2

  constructor(public width: number, public height: number) {
    this.min = new Vector2(-width / 2, -height / 2)
    this.max = new Vector2(width / 2, height / 2)
  }
}
