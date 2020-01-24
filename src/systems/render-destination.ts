import * as PIXI from 'pixi.js'
import { System, Entity, ComponentStorage } from '~/core'
import { ComponentDestination, ComponentOwnership } from '~/components'
import { ResourceSelection, ResourceScene, ResourcePlayers } from '~/resources'

/**
 * SystemRenderDestination is responsible for rendering entity destination point.
 */
export class SystemRenderDestination extends System {
  static id = 'render-destination'
  static query = {
    entities: false,
    components: [ComponentDestination, ComponentOwnership],
    resources: [ResourceSelection, ResourceScene, ResourcePlayers],
  }

  private renderedEntity?: Entity
  private graphics = new PIXI.Graphics()
    .beginFill(0xffffff, 0.2)
    .lineStyle(2, 0xffffff, 0.5)
    .drawCircle(0, 0, 5)
    .endFill()

  public dispatch(
    _: Set<Entity>,
    components: [
      ComponentStorage<ComponentDestination>,
      ComponentStorage<ComponentOwnership>,
    ],
    [selection, scene, players]: [ResourceSelection, ResourceScene, ResourcePlayers],
  ) {
    // clear
    if (
      (this.renderedEntity && !selection.entity) ||
      (this.renderedEntity && this.renderedEntity !== selection.entity)
    ) {
      this.renderedEntity = undefined
      scene.viewport.removeChild(this.graphics)
    }

    // render
    if (!this.renderedEntity && selection.entity) {
      const destination = components[0].get(selection.entity)

      if (destination) {
        // reposition graphics
        this.graphics.position.set(destination.x, destination.y)

        // tint marker
        const ownership = components[1].get(selection.entity)!
        this.graphics.tint = players.get(ownership.playerID)!.color

        // render
        this.renderedEntity = selection.entity
        scene.viewport.addChild(this.graphics)
      }
    }

    // reposition
    if (this.renderedEntity && this.renderedEntity === selection.entity) {
      const destination = components[0].get(selection.entity)

      if (destination) {
        this.graphics.position.set(destination.x, destination.y)
      }
    }
  }
}
