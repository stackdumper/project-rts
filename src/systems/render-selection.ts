import * as PIXI from 'pixi.js'
import { System, Core, Entity } from '~/core'
import { ResourceSelection, ResourceSelectionEvent, ResourceScene } from '~/resources'
import { ComponentPosition, ComponentGraphics } from '~/components'

export class SystemRenderSelection extends System {
  private box?: PIXI.Graphics
  private options = {
    thickness: 3,
    padding: 5,
  }

  // create selection box
  private createBox = (width: number, height: number) => {
    const { thickness, padding } = this.options

    return new PIXI.Graphics()
      .beginFill(0x0abde3, 0.1)
      .lineStyle(thickness, 0x48dbfb)
      .drawRect(
        -(padding + thickness) / 2,
        -(padding + thickness) / 2,
        width + padding + thickness,
        height + padding + thickness,
      )
      .endFill()
  }

  public initialize(core: Core) {
    const selection = core.getResource(ResourceSelection) as ResourceSelection
    const scene = core.getResource(ResourceScene) as ResourceScene

    // add selection box
    selection.events.addListener(
      ResourceSelectionEvent.EntitySelected,
      (entity: Entity) => {
        const position = entity.components.get(ComponentPosition) as ComponentPosition
        const graphics = entity.components.get(ComponentGraphics) as ComponentGraphics

        this.box = this.createBox(graphics.sprite.width, graphics.sprite.height)
        this.box.position.set(position.x, position.y)

        scene.viewport.addChild(this.box)
      },
    )

    // remove selection box
    selection.events.addListener(
      ResourceSelectionEvent.EntityDeselected,
      (entity: Entity) => {
        if (this.box) {
          scene.viewport.removeChild(this.box)
        }
      },
    )
  }
}
