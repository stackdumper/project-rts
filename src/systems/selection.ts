import { System, Core } from '~/core'
import {
  ComponentGraphics,
  ComponentSelectable,
  ComponentPosition,
  ComponentDimensions,
} from '~/components'
import { ResourceSelection, ResourceScene } from '~/resources'

/**
 * SystemSelection is used to add selected entities to selected resource.
 */
export class SystemSelection extends System {
  private canvas = document.getElementById('root')! as HTMLCanvasElement

  public initialize(core: Core) {
    const selection = core.getResource(ResourceSelection) as ResourceSelection
    const scene = core.getResource(ResourceScene) as ResourceScene

    this.canvas.addEventListener('click', (e) => {
      selection.clearSelection()

      for (const entity of core.entities.values()) {
        // continue if doesn't have graphics or is not selectable
        if (!entity.components.has(ComponentSelectable)) continue
        if (!entity.components.has(ComponentGraphics)) continue

        // get position
        const position = entity.components.get(ComponentPosition) as ComponentPosition
        if (!position) continue

        // get dimensions
        const dimensions = entity.components.get(
          ComponentDimensions,
        ) as ComponentDimensions
        if (!dimensions) continue

        // transform on-screen click coordinates to viewport local coordinates
        // @ts-ignore
        const { x: localX, y: localY } = scene.viewport.toLocal({
          x: e.clientX,
          y: e.clientY,
        })

        // check intersection
        const intersects =
          localX > position.x - dimensions.width / 2 &&
          localY > position.y - dimensions.height / 2 &&
          localX < position.x + dimensions.width / 2 &&
          localY < position.y + dimensions.height / 2

        // select entity if intersects
        if (intersects) {
          selection.selectEntity(entity)

          break
        }
      }
    })
  }
}
