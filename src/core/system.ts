import { Core } from './core'

/**
 * System represents a single chunk of logic inside of the game.
 * System can update Entity(ies) and Resource(s).
 */
export abstract class System {
  /** System.id provides a unique identifier for the system to be recognized by Core */
  static id: string

  /** System.initialize is used for one-time initialization during Core.addSystem */
  public initialize(core: Core) {}

  /** System.update is used to update system during Core.update */
  public update(core: Core) {}
}
