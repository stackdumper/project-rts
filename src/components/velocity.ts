import { Component } from '~/core'
import { Vector2 } from '~/math'

export class ComponentVelocity extends Vector2 implements Component {
  static id = 'velocity'
}
