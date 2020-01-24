import * as PIXI from 'pixi.js'
import { System, Entity, ComponentStorage } from '~/core'
import { ComponentPosition, ComponentDimensions, ComponentOwnership } from '~/components'
import { ResourceSelection, ResourceScene, ResourcePlayers } from '~/resources'

/**
 * SystemRenderSelection is used to render a square around selected entity.
 */
export class SystemRenderSelection extends System {
  static id = 'render-selection'
  static query = {
    entities: true,
    components: [ComponentPosition, ComponentDimensions, ComponentOwnership],
    resources: [ResourceSelection, ResourceScene, ResourcePlayers],
  }

  private renderedEntity?: Entity
  private renderedGraphics?: PIXI.Graphics

  public dispatch(
    _: Set<Entity>,
    [sposition, sdimensions, sownership]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
      ComponentStorage<ComponentOwnership>,
    ],
    [selection, scene, players]: [ResourceSelection, ResourceScene, ResourcePlayers],
  ) {
    // remove box
    if (
      (!selection.entity && this.renderedEntity) ||
      selection.entity !== this.renderedEntity
    ) {
      scene.viewport.removeChild(this.renderedGraphics!)

      this.renderedGraphics = undefined

      this.renderedEntity = undefined
    }

    // add box
    if (selection.entity && selection.entity !== this.renderedEntity) {
      const position = sposition.get(selection.entity!)!
      const dimensions = sdimensions.get(selection.entity!)!
      const ownership = sownership.get(selection.entity)!

      this.renderedEntity = selection.entity
      this.renderedGraphics = new PIXI.Graphics()
        .beginFill(0xffffff, 0.1)
        .lineStyle(2, 0xffffff, 0.2)
        .drawRoundedRect(
          dimensions.min.x,
          dimensions.min.y,
          dimensions.width,
          dimensions.height,
          3,
        )
        .endFill()
      this.renderedGraphics.tint = players.get(ownership.playerID)!.color
      this.renderedGraphics.position.set(position.x, position.y)

      scene.viewport.addChild(this.renderedGraphics)
    }

    // reposition box
    if (selection.entity && selection.entity === this.renderedEntity) {
      const position = sposition.get(this.renderedEntity)!

      this.renderedGraphics!.position.set(position.x, position.y)
    }
  }
}
