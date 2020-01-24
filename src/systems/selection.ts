import { System, ComponentStorage, Core } from '~/core'
import { ResourceSelection, ResourceScene } from '~/resources'
import { ComponentPosition, ComponentSelectable, ComponentDimensions } from '~/components'

/**
 * SystemSelection is used to add selected entities to selected resource.
 */
export class SystemSelection extends System {
  static id = 'selection'

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)

    scene.viewport.interactive = true
    scene.viewport.addListener('mousedown', (e) => {
      e.stopPropagation()

      // get selection resource
      const selection = core.getResource(ResourceSelection)

      // reset selection
      selection.entity = undefined

      // transform global on-screen click coordinates to local ones
      // @ts-ignored
      const { x: clickX, y: clickY } = scene.viewport.toLocal(e.data.originalEvent)

      // check intersection for each entity
      for (const [entity, [_, position, dimensions]] of ComponentStorage.join(
        core.getComponent(ComponentSelectable),
        core.getComponent(ComponentPosition),
        core.getComponent(ComponentDimensions),
      )) {
        const intersects =
          clickX > position.x + dimensions.min.x &&
          clickY > position.y + dimensions.min.y &&
          clickX < position.x + dimensions.max.x &&
          clickY < position.y + dimensions.max.y

        if (intersects) {
          selection.entity = entity
          break
        }
      }
    })
  }
}
