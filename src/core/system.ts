import { Core } from './core'

/**
 * System represents a single chunk of logic inside of the game.
 * System can update Entity(ies) and Resource(s).
 */
export abstract class System {
  /** System.initialize is used for one-time initialization during Core.addSystem */
  public initialize(core: Core) {}

  /** System.update is used to update system during Core.update */
  public update(core: Core) {}
}
