import { Component } from '~/core'
import { EntityTemplate } from '~/utils'

export class ComponentProductionOptions extends Component {
  static id = 'production-options'

  public repeat = false
  public stop = false

  constructor(public templates: EntityTemplate[]) {
    super()
  }
}
