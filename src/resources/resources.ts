import { Resource } from '~/core'

export type TResource = {
  current: number
  max: number
  production: number
  consumption: number
}

export class CResource {
  private history: TResource[] = []

  constructor(resource: TResource) {
    this.history.push(resource)
  }

  private get active() {
    return this.history[this.history.length - 1]
  }

  public get current() {
    return this.active?.current || 0
  }

  public get max() {
    return this.active?.max || 0
  }

  public get production() {
    return this.active?.production || 0
  }

  public get consumption() {
    return this.active?.consumption || 0
  }

  public update(resource: TResource) {
    this.history.push(resource)
  }
}

export class ResourceResources extends Resource {
  static id = 'resources'

  public energy = new CResource({
    current: 0,
    max: 7500,
    production: 40,
    consumption: 15,
  })

  public mass = new CResource({
    current: 0,
    max: 10000,
    production: 30,
    consumption: 10,
  })
}
