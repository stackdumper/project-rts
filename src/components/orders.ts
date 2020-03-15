import { Component, Entity } from '~/core'
import { EntityTemplate } from '~/utils'
import { Vector2 } from '~/math'

export type Order =
  | {
      action: 'move'
      position: Vector2
    }
  | {
      action: 'construct'
      position: Vector2
      entity: Entity
      template: EntityTemplate
    }
  | {
      action: 'produce'
      mass: number
      energy: number
      percentage: number
      template: EntityTemplate
    }

export class ComponentOrders extends Component {
  static id = 'orders'

  public orders = new Array<Order>()

  get current() {
    return this.orders[0]
  }

  public set(order: Order) {
    this.orders = [order]
  }

  public push(order: Order) {
    return this.orders.push(order)
  }

  public shift() {
    return this.orders.shift()
  }

  public unshift(order: Order) {
    this.orders.unshift(order)
  }

  public clone() {
    const clone = super.clone()

    clone.orders = [...this.orders]

    return clone
  }
}
