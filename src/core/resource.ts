import { ID, Core } from '.'

export abstract class Resource {
  static id: ID

  public initialize(core: Core): any {}

  constructor(...args: any[]) {}
}
