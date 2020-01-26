import { Component } from '~/core'
import { EntityTemplate } from '~/utils'
import { Vector2 } from '~/math'

type Order =
  | {
      action: 'move'
      position: Vector2
    }
  | {
      action: 'build'
      template: EntityTemplate
      position: Vector2
    }

export class ComponentOrders extends Component {
  static id = 'orders'

  public orders = new Array<Order>()
  public iteration = 0

  get current() {
    return this.orders[0]
  }

  public set(order: Order) {
    this.orders = [order]
  }

  public push(order: Order) {
    this.iteration += 1

    return this.orders.push(order)
  }

  public shift() {
    this.iteration += 1

    return this.orders.shift()
  }

  public clone() {
    const clone = super.clone()

    clone.orders = [...this.orders]

    return clone
  }
}
