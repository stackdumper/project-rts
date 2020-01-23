import { Core, Component, ComponentStorage } from '.'

export enum Action {
  AddEntity = 'add-entity',
  RemoveEntity = 'remove-entity',
}

export type ID = string

export type Entity = ID

export abstract class Resource {
  static id: ID

  public initialize(core: Core): any {}

  constructor(...args: any[]) {}
}

export abstract class System {
  static id: ID

  constructor(...args: any[]) {}

  static query: {
    entities: boolean
    components: typeof Component[]
    resources: typeof Resource[]
  } = {
    entities: false,
    components: [],
    resources: [],
  }

  public initialize(core: Core) {}

  public dispatch(
    entities: Set<Entity>,
    components: ComponentStorage[],
    resources: Resource[],
  ) {}
}
