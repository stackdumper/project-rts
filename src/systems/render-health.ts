import * as PIXI from 'pixi.js'
import { System, ComponentStorage } from '~/core'
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

  private sprites = new Map<string, PIXI.Sprite>()

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
    if (scene.containers.viewport.scale.x < 0.5) {
      scene.containers.indicators.visible = false
      return
    } else {
      scene.containers.indicators.visible = true
    }

    // add missing bars and update existing
    for (const [entity, [position, dimensions, health]] of ComponentStorage.join(
      Position,
      Dimensions,
      Health,
    )) {
      let sprite = this.sprites.get(entity)!

      if (!sprite) {
        sprite = new PIXI.Sprite(textures.get('healthBar'))

        sprite.anchor.set(0.5, -dimensions.max.y * 0.5)

        this.sprites.set(entity, sprite)
        scene.containers.indicators.addChild(sprite)
      }

      sprite.position.set(position.x, position.y)

      const draft = Draft.get(entity)
      if (draft) {
        // if draft, tint blue (progreess bar)
        sprite.scale.x = draft.percentage * dimensions.max.x * 0.04
        sprite.tint = 0x1b9cfc
      } else {
        // if not, tint green (health bar)
        sprite.scale.x = (health.current / health.max) * dimensions.max.x * 0.04
        sprite.tint = 0x55e6c1
      }
    }
  }
}
