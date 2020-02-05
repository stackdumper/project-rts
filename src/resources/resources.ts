import { Resource } from '~/core'

export type TResource = {
  current: number
  previous: number
  max: number
  production: number
  consumption: number
}

export type TResources = {
  mass: TResource
  energy: TResource
}

export class ResourceResources extends Map<number, TResources> implements Resource {
  static id = 'resources'

  constructor(playerIDs: number[]) {
    super()

    for (const playerID of playerIDs) {
      this.set(playerID, {
        mass: {
          current: 650,
          previous: 0,
          max: 650,
          production: 1,
          consumption: 0,
        },

        energy: {
          current: 4000,
          previous: 0,
          max: 4000,
          production: 20,
          consumption: 0,
        },
      })
    }
  }

  public initialize() {}
}
