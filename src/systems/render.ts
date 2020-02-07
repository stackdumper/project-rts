import * as PIXI from 'pixi.js'
import { System, ComponentStorage } from '~/core'
import {
  ResourceScene,
  ResourcePlayers,
  ResourceTextures,
  ResourceSelection,
} from '~/resources'
import {
  ComponentPosition,
  ComponentDimensions,
  ComponentOwnership,
  ComponentDraft,
  ComponentMobile,
  ComponentTexture,
} from '~/components'

/**
 * SystemRender is used to render game content into pixi.js scene.
 */
export class SystemRender extends System {
  static id = 'render'
  static query = {
    core: false,
    components: [
      ComponentPosition,
      ComponentDimensions,
      ComponentOwnership,
      ComponentDraft,
      ComponentTexture,
    ],
    resources: [ResourceScene, ResourceTextures, ResourcePlayers, ResourceSelection],
  }

  private sprites = new Map<string, PIXI.Sprite>()

  public dispatch(
    _: never,
    [Position, Dimensions, Ownership, Draft, Texture]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentDraft>,
      ComponentStorage<ComponentTexture>,
    ],
    [scene, textures, players, selection]: [
      ResourceScene,
      ResourceTextures,
      ResourcePlayers,
      ResourceSelection,
    ],
  ) {
    // skip if land and ground is not visible
    if (!scene.containers.land.visible && !scene.containers.ground.visible) return

    // remove deleted entities
    for (const [entity, sprite] of this.sprites) {
      if (!Dimensions.has(entity)) {
        scene.containers.land.removeChild(sprite)
      }
    }

    // add missing entities
    for (const [
      entity,
      [position, dimensions, ownership, texture],
    ] of ComponentStorage.join(Position, Dimensions, Ownership, Texture)) {
      let sprite = this.sprites.get(entity)

      if (!sprite) {
        sprite = new PIXI.Sprite(textures.get(texture.texture))

        // set dimensions
        sprite.width = dimensions.width
        sprite.height = dimensions.height
        sprite.anchor.set(0.5, 0.5)
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

        // set color
        sprite.tint = players.get(ownership.playerID)!.color

        this.sprites.set(entity, sprite)
        // @ts-ignore FIXME
        scene.containers[texture.texture].addChild(sprite)
      }

      // update position
      sprite!.position.x = position.x
      sprite!.position.y = position.y

      // if draft, set opaque
      const draft = Draft.get(entity)
      if (draft) {
        sprite.alpha = draft.percentage
      }

      // make sprite white if selected
      if (selection.entity === entity) {
        sprite.tint = 0xffffff
      } else if (sprite.tint === 0xffffff) {
        const ownership = Ownership.get(entity)!

        sprite.tint = players.get(ownership.playerID)!.color
      }
    }

    // scene.app.render()
  }
}
