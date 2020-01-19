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
  ResourcePlacement,
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
  SystemPlacement,
  SystemRenderSelection,
} from './systems'
import { entities } from './entities'

window.addEventListener('load', () => {
  // load resources
  ResourceAssets.loadResources().then((assets: any) => {
    const core = new CoreBuilder()
      // add resources
      .withResource(new ResourceKeyboard())
      .withResource(new ResourceCursor())
      .withResource(new ResourceWheel())
      .withResource(new ResourcePlacement())
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
      .withSystem(new SystemRenderSelection())
      .withSystem(new SystemNavigation())
      .withSystem(new SystemUIResources())
      .withSystem(new SystemUIBuildings())
      .withSystem(new SystemRender())
      .withSystem(new SystemRenderMap())
      .withSystem(new SystemPlacement())
      .withSystem(new SystemStats())
      .build()

    // add commander
    core.addEntity(entities.commander.build())

    // start game loop
    {
      const clock = core.getResource(ResourceClock)

      Ticker.shared.add((dt) => {
        // update dt
        clock.dt = dt

        // update core
        core.update()
      })
    }
  })
})
