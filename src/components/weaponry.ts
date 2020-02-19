import { Component } from '~/core'

export class ComponentWeaponry extends Component {
  public cooldown: number

  constructor(public range: number, public reload: number, public damage: number) {
    super()

    this.cooldown = reload
  }
}
