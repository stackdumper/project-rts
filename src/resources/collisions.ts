import { Resource, Entity } from '~/core'

export class ResourceCollisions extends Map<Entity, Entity[]> implements Resource {
  static id = 'collisions'

  public initialize() {}
}
