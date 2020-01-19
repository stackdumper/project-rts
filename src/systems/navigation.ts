import * as PIXI from 'pixi.js'
import { System, Core } from '~/core'
import {
  ResourceKeyboard,
  ResourceClock,
  ResourceScene,
  ResourceWheel,
} from '~/resources'

/**
 * SystemNavigation is responsible for map navigation controls.
 */
export class SystemNavigation extends System {
  private speed = 10.0

  // PLEASE REFACTOR ME
  private scale(viewport: PIXI.Container, scale: number) {
    const x = window.innerWidth / 2
    const y = window.innerHeight / 2

    const wx = (x - viewport.x) / viewport.scale.x
    const wy = (y - viewport.y) / viewport.scale.y

    const s = viewport.scale.y * scale

    if (s > 0.2 && s < 2) {
      const px = wx * s + viewport.x
      const py = wy * s + viewport.y

      viewport.x -= px - x
      viewport.y -= py - y

      viewport.scale.x = s
      viewport.scale.y = s
    }
  }

  public update(core: Core) {
    const { dt } = core.getResource(ResourceClock)
    const { pressed } = core.getResource(ResourceKeyboard)
    const { viewport } = core.getResource(ResourceScene)
    const wheel = core.getResource(ResourceWheel)

    // set scale
    if (Math.abs(wheel.deltaY) > 2) {
      this.scale(viewport, 1 + wheel.deltaY * 0.001)
    }

    // calculate movement speed
    const speed = pressed.has(16) ? this.speed * 3 : this.speed

    // set vertical movement
    if (pressed.has(87)) {
      viewport.position.y += speed * dt * viewport.scale.y
    } else if (pressed.has(83)) {
      viewport.position.y -= speed * dt * viewport.scale.y
    }

    // set horizontal movement
    if (pressed.has(65)) {
      viewport.position.x += speed * dt * viewport.scale.x
    } else if (pressed.has(68)) {
      viewport.position.x -= speed * dt * viewport.scale.x
    }
  }
}
