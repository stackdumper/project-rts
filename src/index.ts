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
import { ComponentPosition, ComponentDimensions } from './components'

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
    // ADD 100 COMMANDERS!!!
    for (let z = 0; z < 10; z++) {
      for (let j = 0; j < 10; j++) {
        const entity = entities.commander.build()
        core.addEntity(entity)

        const position = entity.components.get(ComponentPosition)
        position.x = 100 + 40 * j
        position.y = 100 + 40 * z
      }
    }

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
