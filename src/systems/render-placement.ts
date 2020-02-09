import { System, Entity, ComponentStorage, Core } from '~/core'
import {
  ResourceScene,
  ResourcePlacement,
  ResourceCursor,
  ResourceCollisions,
} from '~/resources'
import {
  ComponentDimensions,
  ComponentOwnership,
  ComponentIcon,
  ComponentTexture,
  ComponentPosition,
} from '~/components'
import { EntityTemplate } from '~/utils'

/**
 * SystemRenderPlacement is responsible for rendering current placement template.
 */
export class SystemRenderPlacement extends System {
  static id = 'render-placement'
  static query = {
    core: true,
    components: [ComponentOwnership, ComponentPosition, ComponentTexture],
    resources: [ResourcePlacement, ResourceScene, ResourceCursor, ResourceCollisions],
  }

  private renderedTemplate?: EntityTemplate

  public dispatch(
    core: Core,
    [Ownership, Position, Texture]: [
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentTexture>,
    ],
    [placement, scene, cursor, collisions]: [
      ResourcePlacement,
      ResourceScene,
      ResourceCursor,
      ResourceCollisions,
    ],
  ) {
    // remove box
    if (
      placement.placeholder &&
      ((!placement.template && this.renderedTemplate) ||
        placement.template !== this.renderedTemplate)
    ) {
      core.removeEntity(placement.placeholder)

      placement.placeholder = undefined
      this.renderedTemplate = undefined
    }

    // add box
    if (placement.template && placement.template !== this.renderedTemplate) {
      const ownership = Ownership.get(placement.builder!)!
      const position = placement.template.getComponent(ComponentPosition)
      const dimensions = placement.template.getComponent(ComponentDimensions)
      const icon = placement.template.getComponent(ComponentIcon)
      const texture = placement.template.getComponent(ComponentTexture)

      placement.placeholder = core.addEntity([
        ownership,
        position,
        dimensions,
        texture,
        icon,
      ])
      this.renderedTemplate = placement.template
    }

    // reposition box
    if (placement.placeholder && placement.template === this.renderedTemplate) {
      // @ts-ignore update position
      const { x, y } = scene.containers.viewport.toLocal(cursor.position)
      Position.get(placement.placeholder!)!.set(
        Math.round(x / 16) * 16,
        Math.round(y / 16) * 16,
      )

      // dim if collides and can't be placed
      const texture = Texture.get(placement.placeholder)!
      if (collisions.has(placement.placeholder)) {
        texture.alpha = 0.2
      } else {
        texture.alpha = 1
      }
    }
  }
}
