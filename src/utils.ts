import { Component } from './core'
import { ComponentOwnership } from './components'

export class EntityTemplate {
  public components = new Map<string, Component>()

  constructor(public name: string) {}

  public withComponents(components: Component[]) {
    for (const component of components) {
      // @ts-ignore
      this.components.set(component.constructor.id, component)
    }

    return this
  }

  public hasComponent(component: typeof Component) {
    return this.components.has(component.id)
  }

  public getComponent<T>(component: (new (...a: any) => T) & typeof Component): T {
    // @ts-ignore
    return this.components.get(component.id) as T
  }

  public build(playerID: number) {
    const components = Array.from(this.components.values()).map((c) => c.clone())

    return [...components, new ComponentOwnership(playerID)]
  }
}
