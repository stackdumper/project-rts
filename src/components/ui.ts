import { Component, Entity } from '~/core'

export interface ComponentUIBuilding {
  title: string
  create: () => Entity
}

export class ComponentUI extends Component {
  constructor(public buildings: ComponentUIBuilding[]) {
    super()
  }
}
