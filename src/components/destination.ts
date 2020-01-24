import { Component } from '~/core'
import { Vector2 } from '~/math'

export class ComponentDestination extends Vector2 implements Component {
  static id = 'destination'
}
