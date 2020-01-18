import * as PIXI from 'pixi.js'
import { Entity, Core } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentUI,
  ComponentSelectable,
} from '~/components'
import { EntityLandFactory } from '.'

export class EntityCommander extends Entity {
  static title = 'Commander'

  public initialize(core: Core) {
    super.initialize(core)

    this.components.set(ComponentPosition, new ComponentPosition(0.0, 0.0))
    this.components.set(ComponentVelocity, new ComponentVelocity(0.0, 0.0))
    this.components.set(ComponentSelectable, new ComponentSelectable())
    this.components.set(
      ComponentUI,
      new ComponentUI([
        {
          title: EntityLandFactory.title,
          create: () => new EntityLandFactory(),
        },
      ]),
    )
    this.components.set(
      ComponentGraphics,
      new ComponentGraphics(PIXI.Texture.WHITE, 32, 32),
    )
  }
}
