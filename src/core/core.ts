import { Entity, System, Resource, ConstructorMap } from '.'
import EventEmitter from 'eventemitter3'

export enum CoreEvent {
  AddResource = 'add-resource',
  AddSystem = 'add-system',
  AddEntity = 'add-entity',
  RemoveEntity = 'remove-entity',
  StartUpdate = 'start-update',
  EndUpdate = 'end-update',
}

/**
 * Core orchestrates entities, systems and resources.
 */
export class Core {
  public entities: Map<string, Entity>
  public systems: ConstructorMap<System>
  public resources: ConstructorMap<Resource>

  /**
   * Core.events provide event bus for use by systems
   */
  public events: EventEmitter<CoreEvent>

  /**
   * Core.constructor creates a new Core instance.
   */
  constructor() {
    this.entities = new Map()
    this.systems = new ConstructorMap()
    this.resources = new ConstructorMap()

    this.events = new EventEmitter()
  }

  /**
   * Core.addResource initializes provided resource
   * and adds it to the list of resources for futher use by systems.
   * Triggers 'add-resource' event.
   */
  public addResource(resource: Resource) {
    resource.initialize(this)

    this.resources.add(resource)

    this.events.emit(CoreEvent.AddResource, resource)
  }

  /**
   * Core.getResource returns a resource by it's constructor.
   * Throws an error if such resource does not exist.
   */
  public getResource<T extends Resource>(resource: new (...args: any) => T) {
    const t = this.resources.get(resource)

    if (!t) {
      throw new Error(`[Core.getResource] unable to find resource: ${resource}`)
    }

    // @ts-ignore
    return t
  }

  /**
   * Core.addSystem initializes provided
   * and adds it to the list of systems for futher dispatch by Core.update.
   * Triggers 'add-system' event.
   */
  public addSystem(system: System) {
    system.initialize(this)

    this.systems.add(system)

    this.events.emit(CoreEvent.AddSystem, system)
  }

  /**
   * Core.addEntity initializes provided entity
   * and adds it to the list of entities for futher update by systems.
   * Triggers 'add-entity' event.
   */
  public addEntity(entity: Entity) {
    if (!entity.initialized) entity.initialize(this)

    this.entities.set(entity.id, entity)

    this.events.emit(CoreEvent.AddEntity, entity)
  }

  /**
   * Core.removeEntity deinitializes provided entity
   * and removes it from the list of entities for futher update by systems.
   * Triggers 'remove-entity' event.
   */
  public removeEntity(entity: Entity) {
    entity.deinitialize(this)

    this.entities.delete(entity.id)

    this.events.emit(CoreEvent.RemoveEntity, entity)
  }

  /**
   * Core.update updates all previously added systems.
   */
  public update() {
    this.events.emit(CoreEvent.StartUpdate)

    for (const system of this.systems.values()) {
      system.update(this)
    }

    this.events.emit(CoreEvent.EndUpdate)
  }
}
