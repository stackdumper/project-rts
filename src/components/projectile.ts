import { Component } from '~/core'

export class ComponentProjectile extends Component {
  static id = 'projectile'

  constructor(public damage: number, public ttl: number) {
    super()
  }
}
