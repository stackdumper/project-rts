import * as PIXI from 'pixi.js'
import { Entity } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentSelectable,
} from '~/components'

export class EntityEngineer extends Entity {
  static title = 'Engineer'

  constructor() {
    super()

    this.components.set(ComponentPosition, new ComponentPosition(0.0, 0.0))
    this.components.set(ComponentVelocity, new ComponentVelocity(0.0, 0.0))
    this.components.set(ComponentSelectable, new ComponentSelectable())
    this.components.set(
      ComponentGraphics,
      new ComponentGraphics(
        new PIXI.Graphics()
          .beginFill(0xffffff)
          .drawRect(0, 0, 16, 16)
          .endFill(),
      ),
    )
  }
}
