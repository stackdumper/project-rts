import { Core } from './core'

/**
 * Resource provides a single shared resource for read/write by System(s).
 */
export class Resource {
  public id = 'test'

  public initialize(core: Core) {}
}
