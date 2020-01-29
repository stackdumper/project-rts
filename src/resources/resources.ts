import { Resource } from '~/core'

export type TResource = {
  current: number
  max: number
  production: number
  consumption: number
}

export class ResourceResources extends Resource {
  static id = 'resources'

  public mass: TResource = {
    current: 650,
    max: 650,
    production: 1,
    consumption: 0,
  }

  public energy: TResource = {
    current: 4000,
    max: 4000,
    production: 20,
    consumption: 0,
  }
}
