import { Entity, Core } from '~/core'
import {
  ComponentPosition,
  ComponentGraphics,
  ComponentUI,
  ComponentSelectable,
} from '~/components'
import { EntityEngineer } from './engineer'
import { ResourceAssets } from '~/resources'

export class EntityLandFactory extends Entity {
  static title = 'Land Factory'

  public initialize(core: Core) {
    super.initialize(core)

    const assets = core.getResource(ResourceAssets) as ResourceAssets

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
      new ComponentGraphics(assets.textures['land_factory'].texture, 128, 128),
    )
  }
}
