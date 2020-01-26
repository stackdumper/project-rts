import { Component } from '~/core'

export class ComponentOwnership extends Component {
  static id = 'ownership'

  constructor(public playerID: number) {
    super()
  }
}
