import { Entity, Core } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentUI,
} from '~/components'
import { ResourceAssets } from '~/resources'

export class EntityCommander extends Entity {
  constructor(position: number[], velocity: number[]) {
    super()

    this.components.set(
      ComponentPosition,
      new ComponentPosition(position[0], position[1]),
    )
    this.components.set(
      ComponentVelocity,
      new ComponentVelocity(velocity[0], velocity[1]),
    )
    this.components.set(
      ComponentUI,
      new ComponentUI([
        { name: 'Mass extractor' },
        { name: 'Enegry generator' },
        { name: 'Land factory' },
        { name: 'Air factory' },
      ]),
    )
  }

  public initialize(core: Core) {
    const assets = core.getResource(ResourceAssets) as ResourceAssets

    const { texture } = assets.resources['electricity']

    this.components.set(ComponentGraphics, new ComponentGraphics(32, 32, texture))
  }
}
