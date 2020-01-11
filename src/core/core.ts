import { Entity, System, Resource } from '.'
import EventEmitter from 'eventemitter3'

/**
 * Core orchestrates entities, systems and resources.
 */
export class Core {
  public entities: Map<string, Entity>
  public systems: Map<string, System>
  public resources: Map<string, Resource>

  /**
   * Core.events provide event bus for use by systems
   */
  public events: EventEmitter<
    | 'add-entity'
    | 'remove-entity'
    | 'add-resource'
    | 'add-system'
    | 'start-update'
    | 'end-update'
  >

  /**
   * Core.constructor creates a new Core instance.
   */
  constructor() {
    this.entities = new Map()
    this.systems = new Map()
    this.resources = new Map()

    this.events = new EventEmitter()
  }

  /**
   * Core.addSystem initializes provided
   * and adds it to the list of systems for futher dispatch by Core.update.
   * Triggers 'add-system' event.
   */
  public addSystem(system: System) {
    system.initialize(this)

    this.systems.set(system.constructor.name, system)

    this.events.emit('add-system', system)
  }

  /**
   * Core.addResource initializes provided resource
   * and adds it to the list of resources for futher use by systems.
   * Triggers 'add-resource' event.
   */
  public addResource(resource: Resource) {
    resource.initialize(this)

    this.resources.set(resource.constructor.name, resource)

    this.events.emit('add-resource', resource)
  }

  /**
   * Core.getREsource returns a resource by it's constructor.
   * Throws an error if such resource does not exist.
   */
  public getResource<T extends Function>(resourceClass: T): Resource {
    const t = this.resources.get(resourceClass.name)

    if (!t) {
      throw new Error(`[Core.getResource] unable to find resource: ${resourceClass.name}`)
    }

    return t
  }

  /**
   * Core.addEntity initializes provided entity
   * and adds it to the list of entities for futher update by systems.
   * Triggers 'add-entity' event.
   */
  public addEntity(entity: Entity) {
    entity.initialize(this)

    this.entities.set(entity.id, entity)

    this.events.emit('add-entity', entity)
  }

  /**
   * Core.removeEntity deinitializes provided entity
   * and removes it from the list of entities for futher update by systems.
   * Triggers 'remove-entity' event.
   */
  public removeEntity(entity: Entity) {
    entity.deinitialize(this)

    this.entities.delete(entity.id)

    this.events.emit('remove-entity', entity)
  }

  /**
   * Core.update updates all previously added systems.
   */
  public update() {
    this.events.emit('start-update')

    for (const system of this.systems.values()) {
      system.update(this)
    }

    this.events.emit('end-update')
  }
}
