import { Ticker } from 'pixi.js'
import { CoreBuilder } from './core'
import {
  ResourceClock,
  ResourceAssets,
  ResourceScene,
  ResourceResources,
  ResourceSelection,
} from './resources'
import {
  SystemVelocity,
  SystemRender,
  SystemResources,
  SystemUIResources,
  SystemUIBuildings,
  SystemSelection,
  SystemStats,
} from './systems'
import { EntityCommander, EntityEngineer } from './entities'

window.addEventListener('load', () => {
  // load resources
  ResourceAssets.loadResources().then((assets) => {
    const core = new CoreBuilder()
      // add resources
      .withResource(new ResourceClock())
      .withResource(new ResourceAssets(assets))
      .withResource(new ResourceResources())
      .withResource(new ResourceSelection())
      .withResource(
        new ResourceScene({ view: document.getElementById('root') as HTMLCanvasElement }),
      )
      // add systems
      .withSystem(new SystemVelocity())
      .withSystem(new SystemResources())
      .withSystem(new SystemSelection())
      .withSystem(new SystemUIResources())
      .withSystem(new SystemUIBuildings())
      .withSystem(new SystemRender())
      // .withSystem(new SystemStats())
      .build()

    core.addEntity(new EntityCommander([800, 400], [0, 0]))
    core.addEntity(new EntityEngineer([600, 400], [0, 0]))
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
