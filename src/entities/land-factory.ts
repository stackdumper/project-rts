import * as PIXI from 'pixi.js'
import { Entity } from '~/core'
import {
  ComponentPosition,
  ComponentGraphics,
  ComponentUI,
  ComponentSelectable,
} from '~/components'
import { EntityEngineer } from './engineer'

export class EntityLandFactory extends Entity {
  static title = 'Land Factory'

  constructor() {
    super()

    this.components.set(ComponentPosition, new ComponentPosition(0.0, 0.0))
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
    this.components.set(
      ComponentGraphics,
      new ComponentGraphics(
        new PIXI.Graphics()
          .beginFill(0xffffff)
          .drawRect(0, 0, 128, 128)
          .endFill(),
      ),
    )
  }
}
