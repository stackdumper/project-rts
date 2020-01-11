import * as PIXI from 'pixi.js'
import { Entity } from '~/core'
import { ComponentPosition, ComponentVelocity, ComponentGraphics } from '~/components'

export class EntityCommander extends Entity {
  constructor(position: number[], velocity: number[]) {
    super()

    this.components.set(
      ComponentPosition.name,
      new ComponentPosition(position[0], position[1]),
    )
    this.components.set(
      ComponentVelocity.name,
      new ComponentVelocity(velocity[0], velocity[1]),
    )
    this.components.set(ComponentGraphics.name, new ComponentGraphics(8, 8, 0xffffff))
  }
}
