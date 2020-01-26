import { Component } from '~/core'

export class ComponentDraft extends Component {
  static id = 'draft'

  public mass = 0
  public energy = 0

  constructor(public totalMass = 0, public totalEnergy = 0) {
    super()
  }
}
