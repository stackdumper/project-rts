import { Component, Entity } from '~/core'

export class ComponentTarget extends Component {
  static id = 'target'

  public target?: Entity
  public distance?: number
}
