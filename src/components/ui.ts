import { Component } from '~/core'

interface ComponentUIBuilding {
  name: string
}

export class ComponentUI extends Component {
  constructor(public buildings: ComponentUIBuilding[]) {
    super()
  }
}
