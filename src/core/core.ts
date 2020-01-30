import nanoid from 'nanoid'
import { ID, Entity, Component, ComponentStorage, System, Resource } from '.'

export class Core {
  public entities = new Set<Entity>()
  public components = new Map<ID, ComponentStorage>()
  public resources = new Map<ID, Resource>()
  public systems = new Map<ID, System>()

  // pre-calculated system queries
  public queries = new Map<
    ID,
    {
      core?: Core
      components: Map<Entity, Component>[]
      resources: Resource[]
    }
  >()

  public addComponent(component: typeof Component) {
    this.components.set(component.id, new Map())
  }

  public getComponent<T extends Component>(
    component: (new (...a: any) => T) & typeof Component,
  ): ComponentStorage<T> {
    return this.components.get(component.id)! as ComponentStorage<T>
  }

  public setComponent(entity: Entity, component: Component) {
    // @ts-ignore
    return this.components.get(component.constructor.id)!.set(entity, component)
  }

  public addEntity(components: Component[]) {
    const entity = nanoid()

    // add associated components
    for (const component of components) {
      // @ts-ignore
      this.components.get(component.constructor.id)!.set(entity, component)
    }

    // add entity
    this.entities.add(entity)

    return entity
  }

  public removeEntity(entity: Entity) {
    // delete entity
    this.entities.delete(entity)

    // delete associated components
    for (const component of this.components.values()) {
      component.delete(entity)
    }
  }

  public async addResource(resource: Resource) {
    // initialize resource
    await resource.initialize(this)

    // @ts-ignore
    this.resources.set(resource.constructor.id, resource)
  }

  public getResource<T extends Resource>(
    resource: (new (...a: any) => T) & typeof Resource,
  ): T {
    return this.resources.get(resource.id)! as T
  }

  public addSystem(system: System) {
    const { query, id } = system.constructor as typeof System

    // initialize system
    system.initialize(this)

    // add system
    this.systems.set(id, system)

    // gather entities
    const core = query.core ? this : undefined

    // gather components
    const components = query.components.map(
      (component) => this.components.get(component.id)!,
    )

    // gether resources
    const resources = query.resources.map((resource) => this.resources.get(resource.id)!)

    // pre-calculate query
    this.queries.set(id, { core, components, resources })
  }

  public dispatch() {
    for (const system of this.systems.values()) {
      // @ts-ignore
      const { core, components, resources } = this.queries.get(system.constructor.id)!

      system.dispatch(core!, components, resources)
    }
  }
}
