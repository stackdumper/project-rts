import { Core, Resource, System, Entity } from '.'

export class CoreBuilder {
  private resources: Resource[] = []
  private systems: System[] = []
  private entities: Entity[] = []

  public withResource(resource: Resource) {
    this.resources.push(resource)

    return this
  }

  public withSystem(system: System) {
    this.systems.push(system)

    return this
  }

  public withEntity(entity: Entity) {
    this.entities.push(entity)

    return this
  }

  public build() {
    const core = new Core()

    // add resources
    for (const resource of this.resources) {
      core.addResource(resource)
    }

    // add systems
    for (const system of this.systems) {
      core.addSystem(system)
    }

    // add entities
    for (const entity of this.entities) {
      core.addEntity(entity)
    }

    return core
  }
}
