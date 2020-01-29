import { ID, Entity, Core, Component, ComponentStorage, Resource } from '.'

export abstract class System {
  /** unique system id */
  static id: ID

  /** System constructor, can accept arbitrary arguments. */
  constructor(...args: any[]) {}

  /**
   * System dispatch dependencies.
   * Components will be replaced with ComponentStorages.
   */
  static query: {
    core: boolean
    components: typeof Component[]
    resources: typeof Resource[]
  } = {
    core: false,
    components: [],
    resources: [],
  }

  /** One-time system initialization.  */
  public initialize(core: Core) {}

  /** Primary citizen in a system, executed on each core dispatch. */
  public dispatch(core: Core, components: ComponentStorage[], resources: Resource[]) {}
}
