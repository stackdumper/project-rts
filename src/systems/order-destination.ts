import { System, Core } from '~/core'
import { ResourceScene, ResourceSelection } from '~/resources'
import { ComponentMobile, ComponentDestination } from '~/components'
import { Vector2 } from '~/math'

/**
 * SystemVelocity is used to apply velocities to entities positions.
 */
export class SystemOrderDestination extends System {
  static id = 'order-destination'

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)
    const selection = core.getResource(ResourceSelection)

    // disable default right-click context menu
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })

    // listen to right clicks on viewport
    scene.viewport.addListener('rightclick', (e) => {
      // skip if no entity is selected
      if (!selection.entity) return

      // skip if entity is not mobile
      if (!core.getComponent(ComponentMobile).has(selection.entity)) return

      // prevent event propogating down
      e.stopPropagation()

      // @ts-ignore
      const { x, y } = scene.viewport.toLocal(e.data.originalEvent)

      // set entity target
      core
        .getComponent(ComponentDestination)
        .set(selection.entity, new ComponentDestination(x, y))
    })
  }
}
