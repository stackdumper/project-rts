import { Entity, Component } from '.'
import { ConstructorMap } from './storage'

export class EntityBuilder {
  constructor(
    public name: string = 'New Entity',
    public components = new ConstructorMap<Component>(),
  ) {}

  public withComponent(component: Component) {
    this.components.add(component.clone())

    return this
  }

  public build() {
    const entity = new Entity()

    for (const component of this.components.values()) {
      entity.components.add(component.clone())
    }

    return entity
  }
}
