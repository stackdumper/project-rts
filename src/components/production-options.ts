import { Component } from '~/core'
import { EntityTemplate } from '~/utils'
import { Vector2 } from '~/math'

export class ComponentProductionOptions extends Component {
  static id = 'production-options'

  public queue: EntityTemplate[] = []
  public destination?: Vector2

  constructor(public templates: EntityTemplate[]) {
    super()
  }
}
