import { Resource, Entity } from '~/core'

export class ResourceSelection extends Resource {
  static id = 'selection'

  public entity?: Entity
}
