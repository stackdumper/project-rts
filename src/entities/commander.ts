import * as PIXI from 'pixi.js'
import { Entity } from '~/core'
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

  constructor() {
    super()

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
      new ComponentGraphics(
        new PIXI.Graphics()
          .beginFill(0xffffff)
          .drawRect(0, 0, 32, 32)
          .endFill(),
      ),
    )
  }
}
