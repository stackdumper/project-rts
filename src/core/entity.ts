import nanoid from 'nanoid'
import { Core, Component } from '.'

/**
 * Entity represents a single entity inside of the game physical and/or graphical world.
 * Entity can be updated by System(s) during the System.update call.
 */
export class Entity {
  /** Entity.title provides human-friendly name of this entity */
  static title: string = 'New Entity'

  /** Entity.id provides a unique identifier for each entity in the game */
  public id: string = nanoid()

  /** Entity.components store entity data for use by systems */
  public components: Map<Function, Component> = new Map()

  /** Entity.initialize is used to initialize entity during Core.addEntity */
  public initialize(core: Core) {}

  /** Entity.initialize is used to deinitialize entity during Core.removeEntity */
  public deinitialize(core: Core) {}
}
