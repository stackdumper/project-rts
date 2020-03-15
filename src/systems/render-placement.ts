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
  ComponentCollidable,
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
    const { placeholder, template, builder } = placement

    // remove box
    if (
      placeholder &&
      ((!template && this.renderedTemplate) || template !== this.renderedTemplate)
    ) {
      core.removeEntity(placeholder)

      placement.placeholder = undefined
      this.renderedTemplate = undefined
    }

    // add box
    if (template && template !== this.renderedTemplate) {
      const ownership = Ownership.get(builder!)!
      const position = template.getComponent(ComponentPosition)
      const dimensions = template.getComponent(ComponentDimensions)
      const icon = template.getComponent(ComponentIcon)
      const texture = template.getComponent(ComponentTexture)

      placement.placeholder = core.addEntity([
        ownership,
        position,
        dimensions,
        texture,
        icon,
        new ComponentCollidable(),
      ])
      this.renderedTemplate = template
    }

    // reposition box
    if (
      placeholder &&
      template === this.renderedTemplate &&
      core.entities.has(placeholder)
    ) {
      // @ts-ignore update position
      const { x, y } = scene.containers.viewport.toLocal(cursor.position)
      Position.get(placeholder)!.set(Math.round(x / 16) * 16, Math.round(y / 16) * 16)

      // dim if collides and can't be placed
      const texture = Texture.get(placeholder)!
      if (collisions.has(placeholder)) {
        texture.alpha = 0.2
      } else {
        texture.alpha = 1
      }
    }
  }
}
