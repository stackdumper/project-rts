import * as PIXI from 'pixi.js'
import { System, ComponentStorage } from '~/core'
import { ResourceScene, ResourcePlayers, ResourceTextures } from '~/resources'
import {
  ComponentPosition,
  ComponentDimensions,
  ComponentOwnership,
  ComponentDraft,
  ComponentMobile,
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
      ComponentMobile,
    ],
    resources: [ResourceScene, ResourceTextures, ResourcePlayers],
  }

  private sprites = new Map<string, PIXI.Sprite>()

  public dispatch(
    _: never,
    [Position, Dimensions, Ownership, Draft, Mobile]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentDraft>,
      ComponentStorage<ComponentMobile>,
    ],
    [scene, textures, players]: [ResourceScene, ResourceTextures, ResourcePlayers],
  ) {
    for (const [entity, sprite] of this.sprites) {
      // remove deleted entities
      if (!Dimensions.has(entity)) {
        scene.containers.land.removeChild(sprite)
      }

      // if draft, set opaque
      const draft = Draft.get(entity)
      if (draft) {
        sprite.alpha =
          (draft.energy / draft.totalEnergy) * 0.5 + (draft.mass / draft.totalMass) * 0.5
      }
    }

    // add missing entities
    for (const [entity, [position, dimensions, ownership]] of ComponentStorage.join(
      Position,
      Dimensions,
      Ownership,
    )) {
      let sprite = this.sprites.get(entity)

      if (!sprite) {
        let type: keyof typeof scene.containers
        if (Mobile.has(entity)) {
          type = 'land'
        } else {
          type = 'ground'
        }

        sprite = new PIXI.Sprite(textures.get(Mobile.has(entity) ? 'land' : 'ground'))

        // set dimensions
        sprite.width = dimensions.width
        sprite.height = dimensions.height
        sprite.anchor.set(0.5, 0.5)
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

        // set color
        sprite.tint = players.get(ownership.playerID)!.color

        this.sprites.set(entity, sprite)
        scene.containers[type].addChild(sprite)
      }

      sprite!.position.x = position.x
      sprite!.position.y = position.y
    }

    // scene.app.render()
  }
}
