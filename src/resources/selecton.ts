import { Resource, Entity } from '~/core'

export class ResourceSelection extends Set<Entity> implements Resource {
  static id = 'selection'

  public initialize() {}
}
