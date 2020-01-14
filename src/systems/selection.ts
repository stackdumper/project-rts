import { System, Core, Entity, CoreEvent } from '~/core'
import { ComponentGraphics } from '~/components'
import { ResourceSelection } from '~/resources'

/**
 * SystemSelection is used to add selected entities to selected resource.
 */
export class SystemSelection extends System {
  private canvas = document.getElementById('root')! as HTMLCanvasElement

  public initialize(core: Core) {
    const selection = core.getResource(ResourceSelection) as ResourceSelection

    this.canvas.addEventListener('click', (e) => {
      selection.selected = []

      for (const entity of core.entities.values()) {
        const graphics = entity.components.get(
          ComponentGraphics.name,
        ) as ComponentGraphics

        graphics.sprite.tint = 0xffffff

        if (graphics) {
          const box = graphics.sprite.getBounds(true)

          if (box.contains(e.clientX, e.clientY)) {
            graphics.sprite.tint = 0x00a8ff

            selection.selected = [entity]
          }
        }
      }
    })
  }
}
