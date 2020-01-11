import * as PIXI from 'pixi.js'
import { Entity } from '~/core'

export class EntityCommander extends Entity {
  constructor(position: number[], velocity: number[]) {
    super()

    this.components = {
      position: position,
      velocity: velocity,
      graphics: new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawRect(0, 0, 8, 8)
        .endFill(),
    }
  }
}
