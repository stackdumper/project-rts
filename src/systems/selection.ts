import * as PIXI from 'pixi.js'
import { System, ComponentStorage, Core } from '~/core'
import {
  ResourceSelection,
  ResourceScene,
  ResourcePlacement,
  ResourceKeyboard,
  ResourceCursor,
  ResourcePlayers,
} from '~/resources'
import {
  ComponentPosition,
  ComponentSelectable,
  ComponentDimensions,
  ComponentOwnership,
} from '~/components'

/**
 * SystemSelection is used to add selected entities to selected resource.
 */
export class SystemSelection extends System {
  static id = 'selection'
  static query = {
    core: false,
    components: [],
    resources: [ResourceScene, ResourceCursor],
  }

  private selection: {
    min?: { x: number; y: number }
    max?: { x: number; y: number }
  } = {}
  private graphics = new PIXI.Graphics()

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)
    const keyboard = core.getResource(ResourceKeyboard)
    const selection = core.getResource(ResourceSelection)
    const players = core.getResource(ResourcePlayers)

    const Position = core.getComponent(ComponentPosition)
    const Selectable = core.getComponent(ComponentSelectable)
    const Dimensions = core.getComponent(ComponentDimensions)
    const Ownership = core.getComponent(ComponentOwnership)

    scene.containers.viewport.addChild(this.graphics)

    // box selection
    scene.view.addEventListener('mousedown', (e) => {
      // skip right click
      if (e.which === 3) return

      // @ts-ignore
      this.selection.min = scene.containers.map.toLocal({
        x: e.clientX,
        y: e.clientY,
      })

      // @ts-ignore set max
      this.selection.max = scene.containers.map.toLocal({
        x: e.clientX,
        y: e.clientY,
      })
    })

    document.addEventListener('mouseup', (e) => {
      this.graphics.clear()

      if (this.selection.min && this.selection.max) {
        // if shift is not pressed
        if (!keyboard.pressed.has(16)) {
          selection.clear()
        }

        // allow selection from any direction
        ;[this.selection.min.x, this.selection.max.x] = [
          Math.min(this.selection.min.x, this.selection.max.x),
          Math.max(this.selection.min.x, this.selection.max.x),
        ]
        ;[this.selection.min.y, this.selection.max.y] = [
          Math.min(this.selection.min.y, this.selection.max.y),
          Math.max(this.selection.min.y, this.selection.max.y),
        ]

        // check intersection for each entity
        for (const [
          entity,
          [_, position, dimensions, ownership],
        ] of ComponentStorage.join(Selectable, Position, Dimensions, Ownership)) {
          // skip if not owned by player
          if (ownership.playerID !== players.currentPlayer) continue

          const intersects =
            position.x - dimensions.min.x >= this.selection.min.x &&
            position.y - dimensions.min.y >= this.selection.min.y &&
            position.x - dimensions.max.x <= this.selection.max.x &&
            position.y - dimensions.max.y <= this.selection.max.y

          if (intersects) {
            selection.add(entity)
          }
        }
      }

      this.selection = {}
    })

    scene.containers.viewport.addListener('mouseup', () => {
      document.getElementById('bottom-menu')!.innerText = ''
    })
  }

  public dispatch(_: never, []: [], [scene, cursor]: [ResourceScene, ResourceCursor]) {
    if (this.selection.min) {
      // @ts-ignore set max
      this.selection.max = scene.containers.map.toLocal({
        x: cursor.position.x,
        y: cursor.position.y,
      })

      // render
      this.graphics.clear()
      this.graphics
        .beginFill(0xffffff, 0.07)
        .lineStyle(1, 0xffffff, 0.5)
        .drawRect(
          this.selection.min.x,
          this.selection.min.y,
          this.selection.max.x - this.selection.min.x,
          this.selection.max.y - this.selection.min.y,
        )
        .endFill()
    }
  }
}
