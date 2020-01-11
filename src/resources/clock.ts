import { Resource, Core } from '~/core'

export class ResourceClock extends Resource {
  public dt: number = 0

  constructor(private framerate = 60) {
    super()
  }

  public initialize(core: Core) {
    let last = 0

    core.events.addListener('start-update', () => {
      const now = performance.now()
      const elapsed = now - last

      last = now

      this.dt = elapsed / this.framerate
    })
  }
}
