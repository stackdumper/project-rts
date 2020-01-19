import { Component } from '~/core'

export class ComponentProjectile extends Component {
  constructor(public speed: number, public damage: number) {
    super()
  }
}
