import { Component, Entity } from '~/core'
import { EntityBuilder } from '~/core/entity-builder'

export class ComponentUI extends Component {
  constructor(public buildings: EntityBuilder[]) {
    super()
  }
}
