import * as PIXI from 'pixi.js'
import { Core } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentDimensions,
  ComponentSelectable,
  ComponentGraphics,
  ComponentOwnership,
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
  ResourcePlayers,
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
  core.addComponent(ComponentOwnership)

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
  await core.addResource(
    new ResourcePlayers(
      new Map([
        [1, { nickname: 'stackdumper', color: 0x1b9cfc }],
        [2, { nickname: 'ololo', color: 0xfc427b }],
      ]),
    ),
  )

  // add systems
  core.addSystem(new SystemVelocity())
  core.addSystem(new SystemResources())
  core.addSystem(new SystemRenderMap())
  core.addSystem(new SystemUIResources())
  core.addSystem(new SystemNavigation())
  core.addSystem(new SystemRender())
  core.addSystem(new SystemSelection())
  core.addSystem(new SystemRenderSelection())

  // add commanders

  for (const i of Array(2)
    .fill(0)
    .map((_, i) => i + 1)) {
    core.addEntity([
      new ComponentOwnership(i),
      new ComponentPosition(100 + i * 400, 300.0),
      new ComponentVelocity(0.0, 0.0),
      new ComponentGraphics('commander'),
      new ComponentDimensions(32, 32),
      new ComponentSelectable(),
    ])
  }

  PIXI.Ticker.shared.add(() => {
    core.dispatch()
  })
})
