import { Component } from '~/core'

export class ComponentProducer extends Component {
  static id = 'producer'

  constructor(public mass = 1, public energy = 1) {
    super()
  }
}
