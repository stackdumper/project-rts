import * as PIXI from 'pixi.js'
import { Component } from '~/core'

export class ComponentGraphics extends Component {
  public sprite: PIXI.Sprite

  constructor(width: number, height: number, _texture: any) {
    super()

    this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    this.sprite.width = width
    this.sprite.height = height
  }
}
