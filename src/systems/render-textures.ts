import * as PIXI from 'pixi.js'
import { System, ComponentStorage, Core, Entity } from '~/core'
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
  ComponentTexture,
} from '~/components'

/**
 * SystemRender is used to render game content into pixi.js scene.
 */
export class SystemRenderTextures extends System {
  static id = 'render-textures'
  static query = {
    core: true,
    components: [
      ComponentPosition,
      ComponentDimensions,
      ComponentOwnership,
      ComponentDraft,
      ComponentTexture,
    ],
    resources: [ResourceScene, ResourceTextures, ResourcePlayers, ResourceSelection],
  }

  private sprites = new Map<Entity, PIXI.Sprite>()

  public dispatch(
    core: Core,
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
      if (!core.entities.has(entity)) {
        // FIXME
        scene.containers.land.removeChild(sprite)
        scene.containers.ground.removeChild(sprite)
        scene.containers.projectile.removeChild(sprite)
        sprite.destroy()

        this.sprites.delete(entity)
      }

      // // not render invisible elements invisible
      // const position = Position.get(entity)
      // if (position) {
      //   // @ts-ignore
      //   const local = scene.containers.land.toGlobal(position)

      //   if (
      //     local.x < 0 ||
      //     local.y < 0 ||
      //     local.x > window.innerWidth ||
      //     local.y > window.innerHeight
      //   ) {
      //     sprite.visible = false
      //   } else {
      //     sprite.visible = true
      //   }
      // }
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

      // make sprite white if selected
      if (selection.has(entity)) {
        sprite.tint = 0xffffff
      } else if (sprite.tint === 0xffffff) {
        const ownership = Ownership.get(entity)!

        sprite.tint = players.get(ownership.playerID)!.color
      }
    }

    // update existing sprites
    for (const [entity, sprite] of this.sprites) {
      const texture = Texture.get(entity)
      if (texture) {
        sprite.alpha = texture.alpha
      }

      const draft = Draft.get(entity)
      if (draft) {
        sprite.alpha = draft.percentage
      }
    }
  }
}
