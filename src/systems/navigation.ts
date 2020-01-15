import { System, Core } from '~/core'
import {
  ResourceKeyboard,
  ResourceClock,
  ResourceScene,
  ResourceWheel,
} from '~/resources'
import { ComponentPosition } from '~/components'

/**
 * SystemNavigation is responsible for navigation controls.
 */
export class SystemNavigation extends System {
  private speed = 5.0

  public update(core: Core) {
    const { dt } = core.getResource(ResourceClock) as ResourceClock
    const { pressed } = core.getResource(ResourceKeyboard) as ResourceKeyboard
    const { viewport } = core.getResource(ResourceScene) as ResourceScene

    // set scale
    const wheel = core.getResource(ResourceWheel) as ResourceWheel
    viewport.scale.set(1 + wheel.y, 1 + wheel.y)

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
