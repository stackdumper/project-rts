import { Component } from '~/core'

export class ComponentEngineering extends Component {
  static id = 'engineering'

  constructor(public rate = 1, public range = 200) {
    super()
  }
}
