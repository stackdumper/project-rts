import { Entity, Core } from '~/core'
import {
  ComponentPosition,
  ComponentGraphics,
  ComponentUI,
  ComponentSelectable,
  ComponentDimensions,
} from '~/components'
import { EntityEngineer } from '.'

export class EntityLandFactory extends Entity {
  static title = 'Land Factory'

  public initialize(core: Core) {
    super.initialize(core)

    this.components.set(ComponentPosition, new ComponentPosition(0.0, 0.0))
    this.components.set(ComponentGraphics, new ComponentGraphics('land_factory'))
    this.components.set(ComponentDimensions, new ComponentDimensions(128, 128))
    this.components.set(ComponentSelectable, new ComponentSelectable())
    this.components.set(
      ComponentUI,
      new ComponentUI([
        {
          title: EntityEngineer.title,
          create: () => new EntityEngineer(),
        },
      ]),
    )
  }
}
