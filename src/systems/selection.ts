import { System, Entity, ComponentStorage } from '~/core'
import { ResourceSelection, ResourceCursor, ResourceScene } from '~/resources'
import {
  ComponentPosition,
  ComponentGraphics,
  ComponentSelectable,
  ComponentDimensions,
} from '~/components'

/**
 * SystemSelection is used to add selected entities to selected resource.
 */
export class SystemSelection extends System {
  static id = 'selection'
  static query = {
    entities: true,
    components: [
      ComponentSelectable,
      ComponentGraphics,
      ComponentPosition,
      ComponentDimensions,
    ],
    resources: [ResourceCursor, ResourceScene, ResourceSelection],
  }

  public dispatch(
    _: Set<Entity>,
    components: [
      ComponentStorage<ComponentSelectable>,
      ComponentStorage<ComponentGraphics>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
    ],
    [cursor, scene, selection]: [ResourceCursor, ResourceScene, ResourceSelection],
  ) {
    // run on click
    if (!cursor.clicked) return

    // unselect entity
    selection.entity = undefined

    // transform on-screen click coordinates to viewport local coordinates
    // @ts-ignore
    const { x: clickX, y: clickY } = scene.viewport.toLocal(cursor.position)

    for (const [entity, [__, _, position, dimensions]] of ComponentStorage.join(
      ...components,
    )) {
      // check intersection
      const intersects =
        clickX > position.x + dimensions.min.x &&
        clickY > position.y + dimensions.min.y &&
        clickX < position.x + dimensions.max.x &&
        clickY < position.y + dimensions.max.y

      // if intersects, set as selected
      if (intersects) {
        selection.entity = entity
        break
      }
    }
  }
}
