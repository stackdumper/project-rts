import { Component } from '~/core'
import { EntityTemplate } from '~/utils'

export class ComponentProductionOptions extends Component {
  static id = 'production-options'

  constructor(public templates: EntityTemplate[], public queue: EntityTemplate[] = []) {
    super()
  }
}
