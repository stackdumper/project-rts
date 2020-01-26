import { Component } from '~/core'
import { EntityTemplate } from '~/utils'

export class ComponentBuildOptions extends Component {
  static id = 'build-options'

  constructor(public templates: EntityTemplate[]) {
    super()
  }
}
