import * as PIXI from 'pixi.js'
import { Core } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentDimensions,
  ComponentSelectable,
  ComponentGraphics,
} from '~/components'
import {
  ResourceKeyboard,
  ResourceCursor,
  ResourceWheel,
  ResourceAssets,
  ResourceResources,
  ResourceMap,
  ResourceClock,
  ResourceSelection,
  ResourceScene,
} from '~/resources'
import {
  SystemVelocity,
  SystemRenderMap,
  SystemResources,
  SystemUIResources,
  SystemNavigation,
  SystemRender,
  SystemSelection,
  SystemRenderSelection,
} from '~/systems'

window.addEventListener('load', async () => {
  const core = new Core()

  // register components
  core.addComponent(ComponentPosition)
  core.addComponent(ComponentVelocity)
  core.addComponent(ComponentDimensions)
  core.addComponent(ComponentSelectable)
  core.addComponent(ComponentGraphics)

  // add resources
  await core.addResource(new ResourceKeyboard())
  await core.addResource(new ResourceCursor())
  await core.addResource(new ResourceWheel())
  await core.addResource(new ResourceAssets())
  await core.addResource(new ResourceResources())
  await core.addResource(new ResourceMap(100, 40))
  await core.addResource(new ResourceClock())
  await core.addResource(new ResourceSelection())
  await core.addResource(new ResourceScene())

  // add systems
  core.addSystem(new SystemVelocity())
  core.addSystem(new SystemResources())
  core.addSystem(new SystemRenderMap())
  core.addSystem(new SystemUIResources())
  core.addSystem(new SystemNavigation())
  core.addSystem(new SystemRender())
  core.addSystem(new SystemSelection())
  core.addSystem(new SystemRenderSelection())

  // add entities
  for (const _ of Array(100)) {
    core.addEntity([
      new ComponentPosition(Math.random(), Math.random()),
      new ComponentVelocity(Math.random(), Math.random()),
      new ComponentGraphics('commander'),
      new ComponentDimensions(32, 32),
      new ComponentSelectable(),
    ])
  }

  PIXI.Ticker.shared.add(() => {
    core.dispatch()
  })
})
