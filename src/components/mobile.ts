import { Component } from '~/core'

export class ComponentMobile implements Component {
  static id = 'mobile'

  constructor(public speed = 1.0) {}
}
