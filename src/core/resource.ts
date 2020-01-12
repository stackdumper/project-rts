import { Core } from './core'

/**
 * Resource provides a single shared resource for read/write by System(s).
 */
export abstract class Resource {
  public initialize(core: Core) {}
}
