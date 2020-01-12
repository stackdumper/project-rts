import * as PIXI from 'pixi.js'
import { Core } from './core'
import { ResourceClock, ResourceAssets, ResourceScene } from './resources'
import { SystemVelocity, SystemRender, SystemStats } from './systems'
import { EntityCommander } from './entities'

window.addEventListener('load', () => {
  // load resources
  ResourceAssets.loadResources().then((assets) => {
    const core = new Core()

    // add resources
    const clock = new ResourceClock()
    core.addResource(clock)
    core.addResource(new ResourceAssets(assets))
    core.addResource(
      new ResourceScene({ view: document.getElementById('root') as HTMLCanvasElement }),
    )

    // add systems
    core.addSystem(new SystemVelocity())
    core.addSystem(new SystemRender(core))
    core.addSystem(new SystemStats())

    // add entities with random positions and velocities
    for (let i = 0; i < 1000; i++) {
      setTimeout(() => {
        core.addEntity(
          new EntityCommander(
            [Math.random() * 100, Math.random() * 100],
            [Math.random() * 2, Math.random() * 2],
          ),
        )
      }, 1 * i)
    }

    PIXI.Ticker.shared.add((dt) => {
      // TODO: update dt
      clock.dt = dt

      // update core
      core.update()
    })
  })
})
