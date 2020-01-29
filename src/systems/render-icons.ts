import * as PIXI from 'pixi.js'
import { System, ComponentStorage } from '~/core'
import { ResourceScene, ResourcePlayers, ResourceIcons } from '~/resources'
import { ComponentPosition, ComponentOwnership, ComponentIcon } from '~/components'

/**
 * SystemRenderIcons is responsible for rendering icons.
 */
export class SystemRenderIcons extends System {
  static id = 'render-icons'
  static query = {
    core: false,
    components: [ComponentPosition, ComponentIcon, ComponentOwnership],
    resources: [ResourceScene, ResourceIcons, ResourcePlayers],
  }

  private sprites = new Map<string, PIXI.Sprite>()

  public dispatch(
    _: never,
    [Position, Icon, Ownership]: [
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentIcon>,
      ComponentStorage<ComponentOwnership>,
    ],
    [scene, icons, players]: [ResourceScene, ResourceIcons, ResourcePlayers],
  ) {
    for (const [entity, sprite] of this.sprites) {
      // remove deleted entities
      if (!Icon.has(entity)) {
        scene.containers.icons.removeChild(sprite)
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
