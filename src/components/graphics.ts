import * as PIXI from 'pixi.js'
import { Component } from '~/core'

export class ComponentGraphics extends Component {
  public graphics: PIXI.Graphics

  constructor(width: number, height: number, color: number) {
    super()

    this.graphics = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, 8, 8)
      .endFill()
  }
}
