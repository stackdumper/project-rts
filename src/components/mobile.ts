import { Component } from '~/core'

export class ComponentMobile extends Component {
  static id = 'mobile'

  constructor(public speed = 1.0) {
    super()
  }
}
