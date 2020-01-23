import { Component } from '~/core'

export class ComponentVelocity implements Component {
  static id = 'velocity'

  constructor(public x: number, public y: number) {}
}
