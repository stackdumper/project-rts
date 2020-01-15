import { Ticker } from 'pixi.js'
import { CoreBuilder } from './core'
import {
  ResourceClock,
  ResourceAssets,
  ResourceScene,
  ResourceResources,
  ResourceMap,
  ResourceSelection,
  ResourceKeyboard,
  ResourceCursor,
  ResourceWheel,
} from './resources'
import {
  SystemVelocity,
  SystemRender,
  SystemResources,
  SystemUIResources,
  SystemRenderMap,
  SystemUIBuildings,
  SystemSelection,
  SystemStats,
  SystemNavigation,
} from './systems'
import { EntityCommander, EntityEngineer } from './entities'

window.addEventListener('load', () => {
  // load resources
  ResourceAssets.loadResources().then((assets) => {
    const core = new CoreBuilder()
      // add resources
      .withResource(new ResourceKeyboard())
      .withResource(new ResourceCursor())
      .withResource(new ResourceWheel())
      .withResource(new ResourceAssets(assets))
      .withResource(new ResourceResources())
      .withResource(new ResourceMap(100, 40))
      .withResource(new ResourceClock())
      .withResource(new ResourceSelection())
      .withResource(new ResourceScene())
      // add systems
      .withSystem(new SystemResources())
      .withSystem(new SystemVelocity())
      .withSystem(new SystemSelection())
      .withSystem(new SystemNavigation())
      .withSystem(new SystemUIResources())
      .withSystem(new SystemUIBuildings())
      .withSystem(new SystemRender())
      .withSystem(new SystemRenderMap())
      .withSystem(new SystemStats())
      .build()

    // add commander and engineer
    core.addEntity(new EntityCommander([800, 400], [0.1, 0]))
    core.addEntity(new EntityEngineer([600, 400], [0.15, 0]))

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
