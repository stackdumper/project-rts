import { Component } from '~/core'

export class ComponentOwnership implements Component {
  static id = 'ownership'

  constructor(public playerID: number) {}
}
