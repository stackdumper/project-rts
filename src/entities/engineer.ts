import { Entity, Core } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentSelectable,
  ComponentDimensions,
} from '~/components'

export class EntityEngineer extends Entity {
  static title = 'Engineer'

  public initialize(core: Core) {
    super.initialize(core)

    this.components.set(ComponentPosition, new ComponentPosition(0.0, 0.0))
    this.components.set(ComponentVelocity, new ComponentVelocity(0.0, 0.0))
    this.components.set(ComponentSelectable, new ComponentSelectable())
    this.components.set(ComponentGraphics, new ComponentGraphics('engineer'))
    this.components.set(ComponentDimensions, new ComponentDimensions(24, 24))
  }
}
