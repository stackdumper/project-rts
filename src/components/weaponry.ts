import { Component } from '~/core'

export class ComponentWeaponry extends Component {
  public cooldown: number

  constructor(
    public range: number,
    public reload: number,
    public damage: number,
    public speed: number,
  ) {
    super()

    this.cooldown = reload
  }
}
