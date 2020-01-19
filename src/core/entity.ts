import nanoid from 'nanoid'
import { Core, Component, ConstructorMap } from '.'

/**
 * Entity represents a single entity inside of the game physical and/or graphical world.
 * Entity can be updated by System(s) during the System.update call.
 */
export class Entity {
  public initialized: boolean = false

  /** Entity.title provides human-friendly name of this entity */
  static title: string = 'New Entity'

  /** Entity.id provides a unique identifier for each entity in the game */
  public id: string = nanoid()

  /** Entity.components store entity data for use by systems */
  public components: ConstructorMap<Component> = new ConstructorMap()

  /** Entity.initialize is used to initialize entity during Core.addEntity */
  public initialize(core: Core) {
    this.initialized = true
  }

  /** Entity.initialize is used to deinitialize entity during Core.removeEntity */
  public deinitialize(core: Core) {}
}
