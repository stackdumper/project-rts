import * as PIXI from 'pixi.js'
import { Component } from '~/core'

export class ComponentGraphics extends Component {
  public sprite: PIXI.Sprite

  constructor(width: number, height: number, texture: PIXI.Texture) {
    super()

    this.sprite = new PIXI.Sprite(texture)
    this.sprite.width = width
    this.sprite.height = height
  }
}
