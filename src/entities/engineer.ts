import * as PIXI from 'pixi.js'
import { Entity, Core } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentSelectable,
} from '~/components'
import { ResourceAssets } from '~/resources'

export class EntityEngineer extends Entity {
  static title = 'Engineer'

  public initialize(core: Core) {
    super.initialize(core)

    const assets = core.getResource(ResourceAssets) as ResourceAssets

    this.components.set(ComponentPosition, new ComponentPosition(0.0, 0.0))
    this.components.set(ComponentVelocity, new ComponentVelocity(0.0, 0.0))
    this.components.set(ComponentSelectable, new ComponentSelectable())
    this.components.set(
      ComponentGraphics,
      new ComponentGraphics(assets.textures['engineer'].texture, 24, 24),
    )
  }
}
