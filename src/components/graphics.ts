import * as PIXI from 'pixi.js'
import { Component } from '~/core'

export class ComponentGraphics extends Component {
  public sprite: PIXI.Graphics

  constructor(graphics: PIXI.Graphics) {
    super()

    this.sprite = graphics
  }
}
