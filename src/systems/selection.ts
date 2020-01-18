import { System, Core } from '~/core'
import { ComponentGraphics, ComponentSelectable } from '~/components'
import { ResourceSelection } from '~/resources'

/**
 * SystemSelection is used to add selected entities to selected resource.
 */
export class SystemSelection extends System {
  private canvas = document.getElementById('root')! as HTMLCanvasElement

  public initialize(core: Core) {
    const selection = core.getResource(ResourceSelection) as ResourceSelection

    this.canvas.addEventListener('click', (e) => {
      selection.clearSelection()

      for (const entity of core.entities.values()) {
        // continue if not selectable
        if (!entity.components.has(ComponentSelectable)) continue

        // get graphics and check if intersects
        const graphics = entity.components.get(ComponentGraphics) as ComponentGraphics

        // if click position is on entity, select it
        if (graphics?.sprite.getBounds().contains(e.clientX, e.clientY)) {
          selection.selectEntity(entity)

          break
        }
      }
    })
  }
}
