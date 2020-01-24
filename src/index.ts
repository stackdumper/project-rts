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
import { entities } from '~/entities'

const createCore = async () => {
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

  return core
}

window.addEventListener('load', async () => {
  const core = await createCore()

  // add commanders
  const players = core.getResource(ResourcePlayers)

  for (const playerID of players.players.keys()) {
    core.addEntity(entities.commander(playerID))
  }

  // start game loop
  const clock = core.getResource(ResourceClock)

  PIXI.Ticker.shared.add((dt) => {
    clock.dt = dt

    core.dispatch()
  })
})
