import * as PIXI from 'pixi.js'
import { System, Entity, ComponentStorage } from '~/core'
import {
  ResourceScene,
  ResourcePlacement,
  ResourceCursor,
  ResourcePlayers,
  ResourceTextures,
} from '~/resources'
import { ComponentDimensions, ComponentOwnership, ComponentMobile } from '~/components'
import { EntityTemplate } from '~/utils'

/**
 * SystemRenderPlacement is responsible for rendering current placement template.
 */
export class SystemRenderPlacement extends System {
  static id = 'render-placement'
  static query = {
    core: false,
    components: [ComponentOwnership, ComponentMobile],
    resources: [
      ResourcePlacement,
      ResourceTextures,
      ResourceScene,
      ResourceCursor,
      ResourcePlayers,
    ],
  }

  private renderedTemplate?: EntityTemplate
  private renderedSprite?: PIXI.Sprite

  public dispatch(
    _: never,
    [Ownership, Mobile]: [
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentMobile>,
    ],
    [placement, textures, scene, cursor, players]: [
      ResourcePlacement,
      ResourceTextures,
      ResourceScene,
      ResourceCursor,
      ResourcePlayers,
    ],
  ) {
    // remove box
    if (
      (!placement.template && this.renderedTemplate) ||
      placement.template !== this.renderedTemplate
    ) {
      scene.containers.viewport.removeChild(this.renderedSprite!)

      this.renderedTemplate = undefined
      this.renderedSprite = undefined
    }

    // add box
    if (placement.template && placement.template !== this.renderedTemplate) {
      this.renderedTemplate = placement.template

      const dimensions = placement.template.getComponent(ComponentDimensions)
      const ownership = Ownership.get(placement.builder!)

      if (dimensions) {
        const sprite = new PIXI.Sprite(
          textures.get(
            placement.template.hasComponent(ComponentMobile) ? 'land' : 'ground',
          ),
        )
        sprite.width = dimensions.width
        sprite.height = dimensions.height
        sprite.alpha = 0.5
        sprite.anchor.set(0.5, 0.5)
        sprite.tint = players.get(ownership!.playerID)!.color

        scene.containers.viewport.addChild(sprite)
        this.renderedSprite = sprite
      }
    }

    // reposition box
    if (placement.template && placement.template === this.renderedTemplate) {
      // @ts-ignore
      const { x, y } = scene.containers.viewport.toLocal(cursor.position)

      this.renderedSprite!.position.set(Math.round(x / 16) * 16, Math.round(y / 16) * 16)
    }
  }
}
