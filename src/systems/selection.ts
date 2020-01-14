import { System, Core } from '~/core'
import { ComponentGraphics } from '~/components'
import { ResourceSelection } from '~/resources'

/**
 * SystemSelection is used to add selected entities to selected resource.
 */
export class SystemSelection extends System {
  private canvas = document.getElementById('root')! as HTMLCanvasElement

  private clearSelection = (selection: ResourceSelection) => {
    if (selection.selected) {
      const graphics = selection.selected.components.get(
        ComponentGraphics.name,
      ) as ComponentGraphics

      if (graphics) {
        graphics.sprite.tint = 0xffffff
      }

      selection.deselectEntity()
    }
  }

  public initialize(core: Core) {
    const selection = core.getResource(ResourceSelection) as ResourceSelection

    this.canvas.addEventListener('click', (e) => {
      this.clearSelection(selection)

      for (const entity of core.entities.values()) {
        const graphics = entity.components.get(
          ComponentGraphics.name,
        ) as ComponentGraphics

        if (graphics) {
          const box = graphics.sprite.getBounds(true)

          // if click position is on entity, select it
          if (box.contains(e.clientX, e.clientY)) {
            graphics.sprite.tint = 0x00a8ff
            selection.selectEntity(entity)

            break
          }
        }
      }
    })
  }
}
