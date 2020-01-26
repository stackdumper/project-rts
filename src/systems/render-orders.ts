import * as PIXI from 'pixi.js'
import { System, Entity, ComponentStorage, Core } from '~/core'
import {
  ComponentOwnership,
  ComponentOrders,
  ComponentGraphics,
  ComponentPosition,
  ComponentDimensions,
} from '~/components'
import {
  ResourceSelection,
  ResourceScene,
  ResourcePlayers,
  ResourceAssets,
} from '~/resources'

/**
 * SystemRenderOrders is responsible for rendering given orders for entity.
 */
export class SystemRenderOrders extends System {
  static id = 'render-destination'
  static query = {
    entities: false,
    components: [ComponentOrders, ComponentPosition, ComponentOwnership],
    resources: [ResourceSelection, ResourcePlayers],
  }

  private renderedEntity?: Entity
  private graphics = new PIXI.Graphics()

  private drawGraphics(
    orders: ComponentOrders,
    position: ComponentPosition,
    ownership: ComponentOwnership,
    players: ResourcePlayers,
  ) {
    const player = players.get(ownership.playerID)!

    this.graphics.moveTo(position.x, position.y)

    for (const order of orders.orders) {
      const { x, y } = order.position

      this.graphics
        .beginFill(player.color, 0.2)
        .lineStyle(2, player.color, 0.5)
        .lineTo(x, y)

      if (order.action === 'move') {
        this.graphics.drawCircle(order.position.x, order.position.y, 5)
      } else if (order.action === 'build') {
        const dimensions = order.template.getComponent(ComponentDimensions)

        this.graphics.drawRect(
          x + dimensions.min.x,
          y + dimensions.min.y,
          dimensions.width,
          dimensions.height,
        )
      }

      this.graphics.endFill()
      this.graphics.moveTo(x, y)
    }
  }

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)

    scene.viewport.addChild(this.graphics)
  }

  public dispatch(
    _: Set<Entity>,
    components: [
      ComponentStorage<ComponentOrders>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentOwnership>,
    ],
    [selection, players]: [ResourceSelection, ResourcePlayers],
  ) {
    const orders = selection.entity ? components[0].get(selection.entity)! : undefined

    if (selection.entity || (!selection.entity && this.renderedEntity)) {
      this.graphics.clear()
      this.renderedEntity = undefined
    }

    if (selection.entity) {
      const position = components[1].get(selection.entity!)
      const ownership = components[2].get(selection.entity!)

      this.drawGraphics(orders!, position!, ownership!, players)
      this.renderedEntity = selection.entity
    }
  }
}
