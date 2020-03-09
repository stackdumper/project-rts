import { System, ComponentStorage, Core } from '~/core'
import {
  ResourceSelection,
  ResourceScene,
  ResourcePlacement,
  ResourceKeyboard,
} from '~/resources'
import { ComponentPosition, ComponentSelectable, ComponentDimensions } from '~/components'

/**
 * SystemSelection is used to add selected entities to selected resource.
 */
export class SystemSelection extends System {
  static id = 'selection'

  private selection: {
    min?: { x: number; y: number }
    max?: { x: number; y: number }
  } = {}

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)
    const placement = core.getResource(ResourcePlacement)
    const keyboard = core.getResource(ResourceKeyboard)
    const selection = core.getResource(ResourceSelection)

    const Position = core.getComponent(ComponentPosition)

    // box selection
    let timeout: NodeJS.Timeout

    scene.view.addEventListener('mousedown', (e) => {
      timeout = setTimeout(() => {
        // @ts-ignore
        this.selection.min = scene.containers.land.toLocal({
          x: e.clientX,
          y: e.clientY,
        })
      }, 150)
    })

    scene.view.addEventListener('mouseup', (e) => {
      clearTimeout(timeout)

      if (this.selection.min) {
        // @ts-ignore
        this.selection.max = scene.containers.land.toLocal({
          x: e.clientX,
          y: e.clientY,
        })

        selection.clear()

        // allow selection from any direction
        ;[this.selection.min.x, this.selection.max.x] = [
          Math.min(this.selection.min.x, this.selection.max.x),
          Math.max(this.selection.min.x, this.selection.max.x),
        ]
        ;[this.selection.min.y, this.selection.max.y] = [
          Math.min(this.selection.min.y, this.selection.max.y),
          Math.max(this.selection.min.y, this.selection.max.y),
        ]

        // select intersecting entities
        for (const [entity, position] of Position) {
          if (
            position.x > this.selection.min.x &&
            position.x < this.selection.max.x &&
            position.y > this.selection.min.y &&
            position.y < this.selection.max.y
          ) {
            selection.add(entity)
          }
        }
      }

      this.selection = {}
    })

    // select one
    scene.view.addEventListener('mousedown', (e) => {
      if (e.which === 3) return

      // skip if placement is in process
      if (placement.template !== undefined) return

      // stop event propagating to children
      e.stopPropagation()

      // reset selection if shift is not pressed
      if (!keyboard.pressed.has(16)) {
        selection.clear()
      }

      // transform global on-screen click coordinates to local ones
      // @ts-ignored
      const { x: clickX, y: clickY } = scene.containers.viewport.toLocal(e)

      // FIXME: clear build menu
      document.getElementById('bottom-menu')!.innerText = ''

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
          selection.add(entity)
        }
      }
    })
  }
}
