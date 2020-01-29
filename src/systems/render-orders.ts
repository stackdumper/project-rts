import * as PIXI from 'pixi.js'
import { System, Entity, ComponentStorage, Core } from '~/core'
import { ComponentOrders, ComponentPosition, ComponentDimensions } from '~/components'
import { ResourceSelection, ResourceScene } from '~/resources'

/**
 * SystemRenderOrders is responsible for rendering given orders for entity.
 */
export class SystemRenderOrders extends System {
  static id = 'render-orders'
  static query = {
    core: false,
    components: [ComponentOrders, ComponentPosition],
    resources: [ResourceSelection],
  }

  private colors = {
    move: 0x1b9cfc,
    construct: 0xeab543,
  }
  private renderedEntity?: Entity
  private graphics = new PIXI.Graphics()

  private drawGraphics(orders: ComponentOrders, position: ComponentPosition) {
    this.graphics.moveTo(position.x, position.y)

    for (const order of orders.orders) {
      const { x, y } = order.position

      this.graphics
        .beginFill(this.colors['move'], 0.2)
        .lineStyle(2, this.colors['move'], 0.5)
        .lineTo(x, y)
        .endFill()
        .beginFill(this.colors[order.action], 0.2)
        .lineStyle(2, this.colors[order.action], 0.5)

      if (order.action === 'move') {
        this.graphics.drawCircle(order.position.x, order.position.y, 5)
      } else if (order.action === 'construct') {
        const dimensions = order.template.getComponent(ComponentDimensions)

        this.graphics.drawRect(
          x + dimensions.min.x,
          y + dimensions.min.y,
          dimensions.width,
          dimensions.height,
        )
      }

      this.graphics.endFill().moveTo(x, y)
    }
  }

  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)

    scene.containers.viewport.addChild(this.graphics)
  }

  public dispatch(
    _: never,
    components: [ComponentStorage<ComponentOrders>, ComponentStorage<ComponentPosition>],
    [selection]: [ResourceSelection],
  ) {
    const orders = selection.entity ? components[0].get(selection.entity)! : undefined

    if (selection.entity || (!selection.entity && this.renderedEntity)) {
      this.graphics.clear()
      this.renderedEntity = undefined
    }

    if (selection.entity) {
      const position = components[1].get(selection.entity!)

      this.drawGraphics(orders!, position!)
      this.renderedEntity = selection.entity
    }
  }
}
