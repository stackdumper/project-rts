import * as PIXI from 'pixi.js'
import { System, Entity, ComponentStorage } from '~/core'
import { ComponentGraphics, ComponentPosition, ComponentDimensions } from '~/components'
import { ResourceScene, ResourceAssets } from '~/resources'

/**
 * SystemRender is used to render game content into pixi.js scene.
 */
export class SystemRender extends System {
  static id = 'render'
  static query = {
    entities: true,
    components: [ComponentGraphics, ComponentPosition, ComponentDimensions],
    resources: [ResourceScene, ResourceAssets],
  }

  private sprites = new Map<string, PIXI.Sprite>()

  public dispatch(
    _: Set<Entity>,
    [sgraphics, sposition, sdimensions]: [
      ComponentStorage<ComponentGraphics>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
    ],
    [scene, assets]: [ResourceScene, ResourceAssets],
  ) {
    // remove deleted entities
    for (const [entity, sprite] of this.sprites) {
      if (!sgraphics.has(entity)) {
        scene.viewport.removeChild(sprite)
      }
    }

    // add missing entities
    for (const [entity, [graphics, position, dimensions]] of ComponentStorage.join(
      sgraphics,
      sposition,
      sdimensions,
    )) {
      let sprite = this.sprites.get(entity)

      // console.log(entity)
      if (!sprite) {
        sprite = new PIXI.Sprite(assets.textures[graphics.texture].texture)

        sprite.width = dimensions.width
        sprite.height = dimensions.height
        sprite.anchor.set(0.5, 0.5)

        this.sprites.set(entity, sprite)
        scene.viewport.addChild(sprite)
      }

      sprite!.position.x = position.x
      sprite!.position.y = position.y
    }
  }
}
