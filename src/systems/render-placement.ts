import * as PIXI from 'pixi.js'
import { System, Entity, Core, ComponentStorage } from '~/core'
import {
  ResourceScene,
  ResourcePlacement,
  ResourceAssets,
  ResourceCursor,
  ResourcePlayers,
  ResourceSelection,
  ResourceKeyboard,
} from '~/resources'
import {
  ComponentGraphics,
  ComponentDimensions,
  ComponentOwnership,
  ComponentOrders,
} from '~/components'
import { EntityTemplate } from '~/utils'
import { Vector2 } from '~/math'

/**
 * SystemRenderPlacement is responsible for rendering current placement template.
 */
export class SystemRenderPlacement extends System {
  static id = 'render-placement'
  static query = {
    entities: true,
    components: [ComponentOwnership],
    resources: [
      ResourcePlacement,
      ResourceAssets,
      ResourceScene,
      ResourceCursor,
      ResourcePlayers,
    ],
  }

  private renderedTemplate?: EntityTemplate
  private renderedSprite?: PIXI.Sprite

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)
    const placement = core.getResource(ResourcePlacement)
    const keyboard = core.getResource(ResourceKeyboard)

    scene.viewport.addListener('click', (e) => {
      if (placement.template) {
        // @ts-ignore
        const { x, y } = scene.viewport.toLocal(e.data.originalEvent)

        // add new order to builder orders queue
        const orders = core.getComponent(ComponentOrders).get(placement.builder!)!

        orders.push({
          action: 'build',
          template: placement.template,
          position: new Vector2(x, y),
        })

        // finish placement if shift is not pressed
        // shift allows to continue placement
        if (!keyboard.pressed.has(16)) {
          placement.template = undefined
        }
      }
    })
  }

  public dispatch(
    _: Set<Entity>,
    [sownership]: [ComponentStorage<ComponentOwnership>],
    [placement, assets, scene, cursor, players]: [
      ResourcePlacement,
      ResourceAssets,
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
      scene.viewport.removeChild(this.renderedSprite!)

      this.renderedTemplate = undefined
      this.renderedSprite = undefined
    }

    // add box
    if (placement.template && placement.template !== this.renderedTemplate) {
      this.renderedTemplate = placement.template

      const graphics = placement.template.getComponent(ComponentGraphics)
      const dimensions = placement.template.getComponent(ComponentDimensions)
      const ownership = sownership.get(placement.builder!)

      if (graphics && dimensions) {
        const texture = assets.textures[graphics.texture]

        const sprite = new PIXI.Sprite(texture.texture)
        sprite.width = dimensions.width
        sprite.height = dimensions.height
        sprite.alpha = 0.5
        sprite.anchor.set(0.5, 0.5)
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
        sprite.tint = players.get(ownership!.playerID)!.color

        scene.viewport.addChild(sprite)

        this.renderedSprite = sprite
      }
    }

    // reposition box
    if (placement.template && placement.template === this.renderedTemplate) {
      // @ts-ignore
      const { x, y } = scene.viewport.toLocal(cursor.position)

      this.renderedSprite!.position.set(x, y)
    }
  }
}
