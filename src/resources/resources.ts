import { Resource } from '~/core'

export type TResource = {
  current: number
  max: number
}

export class CResource {
  private history: TResource[] = []

  constructor(current: number, max: number) {
    this.history.push({
      current,
      max,
    })
  }

  private get active() {
    return this.history[this.history.length - 1]
  }

  private get previous() {
    return this.history[this.history.length - 2]
  }

  public get current() {
    return this.active?.current || 0
  }

  public get max() {
    return this.active?.max || 0
  }

  public get conversion() {
    return (this.active?.current || 0) - (this.previous?.current || 0)
  }

  public update(resource: TResource) {
    this.history.push(resource)
  }
}

export class ResourceResources extends Resource {
  public energy = new CResource(0, 1000)
  public mass = new CResource(0, 750)
}
