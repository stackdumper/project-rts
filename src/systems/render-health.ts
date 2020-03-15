import * as PIXI from 'pixi.js'
import { System, ComponentStorage, Entity } from '~/core'
import { ResourceScene, ResourceTextures } from '~/resources'
import {
  ComponentPosition,
  ComponentHealth,
  ComponentDimensions,
  ComponentDraft,
} from '~/components'

/**
 * SystemRenderHealth is responsible for rendering health bars.
 */
export class SystemRenderHealth extends System {
  static id = 'render-health'
  static query = {
    core: false,
    components: [ComponentPosition, ComponentDimensions, ComponentHealth, ComponentDraft],
    resources: [ResourceScene, ResourceTextures],
  }

  private sprites = new Map<Entity, PIXI.Sprite>()

  public dispatch(
    _: never,
    [Position, Dimensions, Health, Draft]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
      ComponentStorage<ComponentHealth>,
      ComponentStorage<ComponentDraft>,
    ],
    [scene, textures]: [ResourceScene, ResourceTextures],
  ) {
    // skip if health is not visible
    if (!scene.containers.health.visible) return

    // remove deleted entities
    for (const [entity, sprite] of this.sprites) {
      if (!Dimensions.has(entity)) {
        this.sprites.delete(entity)
        scene.containers.health.removeChild(sprite)
      }
    }

    // add missing bars and update existing
    for (const [entity, [position, dimensions, health]] of ComponentStorage.join(
      Position,
      Dimensions,
      Health,
    )) {
      // skip if draft
      if (Draft.has(entity)) continue

      // get sprite
      let sprite = this.sprites.get(entity)!

      // if not present, create sprite
      if (!sprite) {
        sprite = new PIXI.Sprite(textures.get('healthBar'))

        sprite.anchor.set(0.5, -dimensions.max.y * 0.5)

        this.sprites.set(entity, sprite)
        scene.containers.health.addChild(sprite)
      }

      // update position and set scale to match health
      sprite.position.set(position.x, position.y)
      sprite.scale.x = (health.current / health.max) * dimensions.max.x * 0.04
    }
  }
}
