import { System, Core } from '~/core'
import { ResourceScene, ResourceSelection, ResourceKeyboard } from '~/resources'
import { ComponentMobile, ComponentOrders } from '~/components'
import { Vector2 } from '~/math'

/**
 * SystemOrderMove is responsible for activating move orders.
 */
export class SystemOrderMove extends System {
  static id = 'order-destination'

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)
    const selection = core.getResource(ResourceSelection)
    const keyboard = core.getResource(ResourceKeyboard)

    // disable default right-click context menu
    scene.view.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })

    document.addEventListener(
      'mousewheel',
      (e) => {
        // @ts-ignore
        if (e.ctrlKey) {
          e.preventDefault()
        }
      },
      { passive: false },
    )

    // listen to right clicks on viewport
    scene.view.addEventListener('contextmenu', (e) => {
      // skip if no entity is selected
      if (!selection.size) return

      // prevent event propogating down
      e.stopPropagation()

      // @ts-ignore
      const { x, y } = scene.containers.viewport.toLocal(e)

      for (const entity of selection) {
        // skip if entity is not mobile
        if (!core.getComponent(ComponentMobile).has(entity)) continue

        // add movemeent order
        const orders = core.getComponent(ComponentOrders).get(entity)!

        // if shift is pressed, add order to the queue
        // if not, override previous orders
        if (keyboard.pressed.has(16)) {
          orders.push({
            action: 'move',
            position: new Vector2(x, y),
          })
        } else {
          orders.set({
            action: 'move',
            position: new Vector2(x, y),
          })
        }
      }
    })
  }
}
