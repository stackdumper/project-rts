import * as PIXI from 'pixi.js'
import { System, ComponentStorage, Entity } from '~/core'
import { ResourceScene, ResourceTextures } from '~/resources'
import {
  ComponentPosition,
  ComponentDimensions,
  ComponentDraft,
  ComponentOrders,
} from '~/components'

/**
 * SystemRenderHealth is responsible for rendering health bars.
 */
export class SystemRenderProgress extends System {
  static id = 'render-progress'
  static query = {
    core: false,
    components: [ComponentPosition, ComponentDimensions, ComponentDraft, ComponentOrders],
    resources: [ResourceScene, ResourceTextures],
  }

  private sprites = new Map<Entity, PIXI.Sprite>()

  public dispatch(
    _: never,
    [Position, Dimensions, Draft, Orders]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
      ComponentStorage<ComponentDraft>,
      ComponentStorage<ComponentOrders>,
    ],
    [scene, textures]: [ResourceScene, ResourceTextures],
  ) {
    // skip if progress is not visible
    if (!scene.containers.progress.visible) return

    // remove deleted entities
    for (const [entity, sprite] of this.sprites) {
      if (!Dimensions.has(entity)) {
        this.sprites.delete(entity)
        scene.containers.progress.removeChild(sprite)
      }
    }

    // add missing entities and update existing
    for (const [entity, [position, dimensions]] of ComponentStorage.join(
      Position,
      Dimensions,
    )) {
      // get sprite
      let sprite = this.sprites.get(entity)!

      // if not present, create sprite
      if (!sprite) {
        sprite = new PIXI.Sprite(textures.get('progressBar'))

        this.sprites.set(entity, sprite)
        scene.containers.progress.addChild(sprite)
      }

      // update position
      sprite.position.set(position.x, position.y)

      // if draft, show draft completion percentage
      const draft = Draft.get(entity)
      if (draft) {
        sprite.alpha = 1
        sprite.scale.x = draft.percentage * dimensions.max.x * 0.04
        sprite.anchor.set(0.5, -dimensions.max.y * 0.5)
        continue
      }

      // if has orders, render progress on the nearest order
      const orders = Orders.get(entity)
      if (orders && orders.current) {
        const { current } = orders

        // move sprite lower than health bar
        sprite.anchor.set(0.5, -dimensions.max.y * 0.5 - 1.3)
        sprite.alpha = 1

        // if order is to produce, show production percentage
        if (current.action === 'produce') {
          sprite.scale.x = current.percentage * dimensions.max.x * 0.04
          continue
        }

        // if order is to construct, show entity draft percentage
        if (current.action === 'construct') {
          const draft = Draft.get(current.entity!)

          if (draft) {
            sprite.scale.x = draft.percentage * dimensions.max.x * 0.04
            continue
          }
        }
      }

      sprite.alpha = 0
    }
  }
}
