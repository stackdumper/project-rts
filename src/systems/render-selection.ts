import * as PIXI from 'pixi.js'
import { System, Core, Entity } from '~/core'
import { ResourceSelection, ResourceSelectionEvent, ResourceScene } from '~/resources'
import { ComponentPosition, ComponentGraphics, ComponentDimensions } from '~/components'

/**
 * SystemRenderSelection is responsible for rendering a box around selected entities.
 */
export class SystemRenderSelection extends System {
  private box?: PIXI.Graphics
  private options = {
    thickness: 2.5,
    padding: 4,
  }

  // create selection box
  private createBox = ({ min, max, width, height }: ComponentDimensions) => {
    const { thickness, padding } = this.options

    return new PIXI.Graphics()
      .beginFill(0x25ccf7, 0.1)
      .lineStyle(thickness, 0x25ccf7)
      .drawRect(
        min.x - padding,
        min.y - padding,
        width + padding * 2,
        height + padding * 2,
      )
      .endFill()
  }

  public initialize(core: Core) {
    const selection = core.getResource(ResourceSelection)
    const scene = core.getResource(ResourceScene)

    // add selection box
    selection.events.addListener(
      ResourceSelectionEvent.EntitySelected,
      (entity: Entity) => {
        // skip if has no graphics
        if (!entity.components.has(ComponentGraphics)) return

        // get position to adjust box position
        const position = entity.components.get(ComponentPosition)
        if (!position) return

        // get dimensions to adjust box dimensions
        const dimensions = entity.components.get(ComponentDimensions)
        if (!dimensions) return

        // create box and adjust position
        this.box = this.createBox(dimensions)
        this.box.position.set(position.x, position.y)

        // add box to viewport
        scene.viewport.addChild(this.box)
      },
    )

    // remove selection box
    selection.events.addListener(
      ResourceSelectionEvent.EntityDeselected,
      (entity: Entity) => {
        // remove box if present
        if (this.box) {
          scene.viewport.removeChild(this.box)
        }
      },
    )
  }
}
