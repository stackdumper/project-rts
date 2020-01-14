import { Ticker } from 'pixi.js'
import { CoreBuilder } from './core'
import {
  ResourceClock,
  ResourceAssets,
  ResourceScene,
  ResourceResources,
  ResourceMap,
} from './resources'
import {
  SystemVelocity,
  SystemRender,
  SystemStats,
  SystemResources,
  SystemUIResources,
} from './systems'
import { EntityCommander } from './entities'

window.addEventListener('load', () => {
  // load resources
  ResourceAssets.loadResources().then((assets) => {
    const core = new CoreBuilder()
      // add resources
      .withResource(new ResourceClock())
      .withResource(new ResourceAssets(assets))
      .withResource(new ResourceResources())
      .withResource(
        new ResourceScene({ view: document.getElementById('root') as HTMLCanvasElement }),
      )
      .withResource(new ResourceMap())
      // add systems
      .withSystem(new SystemVelocity())
      .withSystem(new SystemResources())
      .withSystem(new SystemUIResources())
      .withSystem(new SystemRender())
      // .withSystem(new SystemStats())
      .build()

    // add entities with random positions and velocities
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        core.addEntity(
          new EntityCommander(
            [Math.random() * 100, Math.random() * 100],
            [Math.random() * 3, Math.random() * 3],
          ),
        )
      }, 1 * i)
    }

    // start game loop
    const clock = core.getResource(ResourceClock) as ResourceClock

    Ticker.shared.add((dt) => {
      // TODO: update dt
      clock.dt = dt

      // update core
      core.update()
    })
  })
})
