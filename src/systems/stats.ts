import Stats from 'stats.js'
import { System, Core, CoreEvent } from '~/core'

/**
 * SystemStats is used to display debug statistics.
 */
export class SystemStats extends System {
  static id = 'stats'

  private stats: Stats
  private entities: Stats.Panel

  constructor() {
    super()

    this.stats = new Stats()
    this.stats.showPanel(0)
    this.entities = this.stats.addPanel(new Stats.Panel('entities', '#ff9ff3', '#341f97'))

    document.body.appendChild(this.stats.dom)
  }

  public initialize(core: Core) {
    core.events.addListener(CoreEvent.StartUpdate, () => {
      this.stats.begin()
    })

    core.events.addListener(CoreEvent.EndUpdate, () => {
      this.stats.end()
    })
  }

  public update(core: Core) {
    this.entities.update(core.entities.size, 1000)
  }
}
