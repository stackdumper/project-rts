import { System, Core } from '~/core'
import {
  ResourceScene,
  ResourcePlacement,
  ResourceKeyboard,
  ResourceCollisions,
} from '~/resources'
import { ComponentOrders, ComponentOwnership } from '~/components'
import { Vector2 } from '~/math'

/**
 * SystemOrderBuild is responsible for activating build orders.
 */
export class SystemOrderBuild extends System {
  static id = 'order-build'

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)
    const placement = core.getResource(ResourcePlacement)
    const keyboard = core.getResource(ResourceKeyboard)
    const collisions = core.getResource(ResourceCollisions)

    window.addEventListener('keydown', (k) => {
      if (k.keyCode === 27 && placement.template) {
        placement.template = undefined
        placement.builder = undefined
      }
    })

    scene.containers.viewport.addListener('click', (e) => {
      if (
        placement.template &&
        placement.placeholder &&
        !collisions.has(placement.placeholder)
      ) {
        // @ts-ignore
        const { x, y } = scene.containers.viewport.toLocal(e.data.originalEvent)
        const position = new Vector2(x, y)
          .clone()
          .divideScalar(16)
          .round()
          .multiplyScalar(16)

        // add new order to builder orders queue
        const orders = core.getComponent(ComponentOrders).get(placement.builder!)!

        const ownership = core.getComponent(ComponentOwnership).get(placement.builder!)!

        // if shift is pressed, add order to queue
        // else, override previous order
        if (keyboard.pressed.has(16)) {
          orders.push({
            action: 'construct',
            template: placement.template,
            position: position,
            playerID: ownership.playerID,
          })
        } else {
          orders.set({
            action: 'construct',
            template: placement.template,
            position: position,
            playerID: ownership.playerID,
          })
        }

        // finish placement if shift is not pressed
        // shift allows to continue placement
        if (!keyboard.pressed.has(16)) {
          placement.template = undefined
          placement.builder = undefined
        }
      }
    })
  }
}
