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
      entities: Set<Entity>
      components: Map<Entity, Component>[]
      resources: Resource[]
    }
  >()

  public addComponent(component: typeof Component) {
    this.components.set(component.id, new Map())
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

  public addSystem(system: System) {
    const { query, id } = system.constructor as typeof System

    // initialize system
    system.initialize(this)

    // add system
    this.systems.set(id, system)

    // gather entities
    const entities = this.entities

    // gather components
    const components = query.components.map(
      (component) => this.components.get(component.id)!,
    )

    // gether resources
    const resources = query.resources.map((resource) => this.resources.get(resource.id)!)

    // pre-calculate query
    this.queries.set(id, { entities, components, resources })
  }

  public dispatch() {
    for (const system of this.systems.values()) {
      // @ts-ignore
      const { entities, components, resources } = this.queries.get(system.constructor.id)!

      system.dispatch(entities, components, resources)
    }
  }
}
