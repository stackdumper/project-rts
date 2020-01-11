import { Entity, System, Resource } from '.'
import EventEmitter from 'eventemitter3'

/**
 * Core orchestrates entities, systems and resources.
 */
export class Core {
  public entities: Set<Entity>
  public systems: Set<System>
  public resources: Set<Resource>

  /**
   * Core.events provide event bus for use by systems
   */
  public events: EventEmitter<
    'add-entity' | 'remove-entity' | 'add-resource' | 'add-system'
  >

  /**
   * Core.constructor creates a new Core instance.
   */
  constructor() {
    this.entities = new Set()
    this.systems = new Set()
    this.resources = new Set()

    this.events = new EventEmitter()
  }

  /**
   * Core.addSystem initializes provided
   * and adds it to the list of systems for futher dispatch by Core.update.
   * Triggers 'add-system' event.
   */
  public addSystem(system: System) {
    system.initialize(this)

    this.systems.add(system)

    this.events.emit('add-system', system)
  }

  /**
   * Core.addResource initializes provided resource
   * and adds it to the list of resources for futher use by systems.
   * Triggers 'add-resource' event.
   */
  public addResource(resource: Resource) {
    resource.initialize(this)

    this.resources.add(resource)

    this.events.emit('add-resource', resource)
  }

  /**
   * Core.addEntity initializes provided entity
   * and adds it to the list of entities for futher update by systems.
   * Triggers 'add-entity' event.
   */
  public addEntity(entity: Entity) {
    entity.initialize(this)

    this.entities.add(entity)

    this.events.emit('add-entity', entity)
  }

  /**
   * Core.addEntity initializes provided entity
   * and adds it to the list of entities for futher update by systems.
   * Triggers 'add-entity' event.
   */
  public removeEntity(entity: Entity) {
    entity.deinitialize(this)

    this.entities.delete(entity)

    this.events.emit('remove-entity', entity)
  }

  /**
   * Core.update updates all previously added systems.
   */
  public update() {
    for (const system of this.systems) {
      system.update(this)
    }
  }
}
