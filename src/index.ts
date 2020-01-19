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
  SystemRenderEntities,
  SystemResources,
  SystemUIResources,
  SystemRenderMap,
  SystemUIBuildings,
  SystemSelection,
  SystemStats,
  SystemNavigation,
  SystemPlacement,
  SystemRenderSelection,
  SystemWeaponry,
  SystemProjectile,
  SystemHealth,
} from './systems'
import { entities } from './entities'
import { ComponentPosition, ComponentOwnership } from './components'

// TODO: ComponentTarget
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
      .withSystem(new SystemWeaponry())
      .withSystem(new SystemProjectile())
      .withSystem(new SystemHealth())
      .withSystem(new SystemSelection())
      .withSystem(new SystemRenderSelection())
      .withSystem(new SystemNavigation())
      .withSystem(new SystemUIResources())
      .withSystem(new SystemUIBuildings())
      .withSystem(new SystemRenderEntities())
      .withSystem(new SystemRenderMap())
      .withSystem(new SystemPlacement())
      .withSystem(new SystemStats())
      .build()

    // add commander
    new Array(2)
      .fill(0)
      .map((_, i) => i + 1)
      .forEach((i) => {
        const entity = entities.commander.build()

        const position = entity.components.get(ComponentPosition)
        position.x = 300 * i - 1
        position.y = 300

        const ownership = entity.components.get(ComponentOwnership)
        ownership.playerID = i

        core.addEntity(entity)
      })

    // start game loop
    {
      const clock = core.getResource(ResourceClock)

      Ticker.shared.add((dt, asd) => {
        // update dt
        clock.dt = dt

        // update core
        core.update()
      })
    }
  })
})
