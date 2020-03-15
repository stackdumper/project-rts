import * as PIXI from 'pixi.js'
import { System, ComponentStorage, Entity } from '~/core'
import {
  ResourceScene,
  ResourcePlayers,
  ResourceIcons,
  ResourceSelection,
} from '~/resources'
import {
  ComponentPosition,
  ComponentOwnership,
  ComponentIcon,
  ComponentDraft,
} from '~/components'

/**
 * SystemRenderIcons is responsible for rendering icons.
 */
export class SystemRenderIcons extends System {
  static id = 'render-icons'
  static query = {
    core: false,
    components: [ComponentPosition, ComponentIcon, ComponentOwnership, ComponentDraft],
    resources: [ResourceScene, ResourceIcons, ResourcePlayers, ResourceSelection],
  }

  private sprites = new Map<Entity, PIXI.Sprite>()

  public dispatch(
    _: never,
    [Position, Icon, Ownership, Draft]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentIcon>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentDraft>,
    ],
    [scene, icons, players, selection]: [
      ResourceScene,
      ResourceIcons,
      ResourcePlayers,
      ResourceSelection,
    ],
  ) {
    for (const [entity, sprite] of this.sprites) {
      // remove deleted entities
      if (!Icon.has(entity)) {
        this.sprites.delete(entity)
        scene.containers.icons.removeChild(sprite)
        continue
      }

      const draft = Draft.get(entity)
      if (draft) {
        sprite.alpha = 0.2 + draft.percentage * 0.8
      }

      // make icon white if selected
      if (selection.has(entity)) {
        sprite.tint = 0xffffff
      } else if (sprite.tint === 0xffffff) {
        const ownership = Ownership.get(entity)!

        sprite.tint = players.get(ownership!.playerID)?.color || 0x000000
      }
    }

    // add missing entities
    for (const [entity, [position, icon, ownership]] of ComponentStorage.join(
      Position,
      Icon,
      Ownership,
    )) {
      let sprite = this.sprites.get(entity)

      if (!sprite) {
        sprite = new PIXI.Sprite(icons.get(icon.icon))

        // set anchor
        sprite.anchor.set(0.5, 0.5)

        // set dimensions
        sprite.width = 32
        sprite.height = 32

        // set scale
        sprite.scale.set(icon.scale)

        // set scale mode
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR

        // set tint depending on player
        sprite.tint = players.get(ownership.playerID)!.color

        this.sprites.set(entity, sprite)
        scene.containers.icons.addChild(sprite)
      }

      // @ts-ignore
      const { x: localX, y: localY } = scene.containers.viewport.toGlobal(position)

      sprite!.position.x = localX
      sprite!.position.y = localY
    }
  }
}
