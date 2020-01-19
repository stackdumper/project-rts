import { Component } from '~/core'

export class ComponentWeaponry extends Component {
  public cooldown: number

  constructor(
    public damage: number,
    public frequency: number,
    public speed: number = 1,
    public range: number = 10,
  ) {
    super()

    this.cooldown = this.frequency
  }
}
