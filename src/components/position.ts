import { Component } from '~/core'

export class ComponentPosition implements Component {
  static id = 'position'

  constructor(public x: number, public y: number) {}
}
