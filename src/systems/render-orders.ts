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

  // colors for each order type
  private graphics = new PIXI.Graphics()
  private colors = {
    move: 0x1b9cfc,
    construct: 0xeab543,
  }

  private drawGraphics(orders: ComponentOrders, position: ComponentPosition) {
    // start at the entity position
    this.graphics.moveTo(position.x, position.y)

    for (const order of orders.orders) {
      if (!('position' in order)) continue

      const { x, y } = order.position

      // draw line to the order position
      this.graphics
        .beginFill(this.colors['move'], 0.2)
        .lineStyle(8, this.colors['move'], 0.4)
        .lineTo(x, y)
        .endFill()
        .beginFill(this.colors[order.action], 0.2)
        .lineStyle(2, this.colors[order.action], 0.5)

      if (order.action === 'move') {
        // draw destination circle
        this.graphics.drawCircle(order.position.x, order.position.y, 5)
      } else if (order.action === 'construct') {
        // draw building rectangle
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

  // add orders graphics to the scene
  public initialize(core: Core) {
    const scene = core.getResource(ResourceScene)

    scene.containers.viewport.addChild(this.graphics)
  }

  public dispatch(
    _: never,
    [Orders, Position]: [
      ComponentStorage<ComponentOrders>,
      ComponentStorage<ComponentPosition>,
    ],
    [selection]: [ResourceSelection],
  ) {
    // clear graphics
    this.graphics.clear()

    for (const entity of selection) {
      const orders = Orders.get(entity)
      const position = Position.get(entity)

      if (orders && position) {
        this.drawGraphics(orders, position)
      }
    }

    // clear missing entities
    // const orders = selection.entity ? components[0].get(selection.entity)! : undefined
    // // clear orders if entity is being selected or is deselected
    // if (selection.entity || (!selection.entity && this.renderedEntity)) {
    //   this.graphics.clear()
    //   this.renderedEntity = undefined
    // }
    // // draw orders if entity is selected
    // if (selection.entity && orders) {
    //   const position = components[1].get(selection.entity!)
    //   this.drawGraphics(orders!, position!)
    //   this.renderedEntity = selection.entity
    // }
  }
}
