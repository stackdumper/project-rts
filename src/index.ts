import * as PIXI from 'pixi.js'
import { Core } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentDimensions,
  ComponentSelectable,
  ComponentOwnership,
  ComponentMobile,
  ComponentDraft,
  ComponentBuildOptions,
  ComponentOrders,
  ComponentEngineering,
  ComponentProducer,
  ComponentIcon,
  ComponentProductionOptions,
  ComponentTexture,
} from '~/components'
import {
  ResourceKeyboard,
  ResourceCursor,
  ResourceWheel,
  ResourceIcons,
  ResourceTextures,
  ResourceResources,
  ResourceMap,
  ResourceClock,
  ResourceSelection,
  ResourceScene,
  ResourcePlayers,
  ResourcePlacement,
} from '~/resources'
import {
  SystemVelocity,
  SystemRenderMap,
  SystemProduction,
  SystemUIResources,
  SystemNavigation,
  SystemRender,
  SystemSelection,
  SystemOrderMove,
  SystemFollowOrderMove,
  SystemRenderOrders,
  SystemUIBuildOptions,
  SystemRenderPlacement,
  SystemOrderBuild,
  SystemFollowOrderBuild,
  SystemRenderIcons,
  SystemUIProductionOptions,
  SystemFollowOrderProduce,
} from '~/systems'
import * as entities from '~/entities'

const createCore = async () => {
  const core = new Core()

  // register components
  core.addComponent(ComponentPosition)
  core.addComponent(ComponentVelocity)
  core.addComponent(ComponentDimensions)
  core.addComponent(ComponentIcon)
  core.addComponent(ComponentTexture)
  core.addComponent(ComponentSelectable)
  core.addComponent(ComponentOwnership)
  core.addComponent(ComponentMobile)
  core.addComponent(ComponentDraft)
  core.addComponent(ComponentBuildOptions)
  core.addComponent(ComponentProductionOptions)
  core.addComponent(ComponentOrders)
  core.addComponent(ComponentEngineering)
  core.addComponent(ComponentProducer)

  // add resources
  await core.addResource(new ResourceKeyboard())
  await core.addResource(new ResourceCursor())
  await core.addResource(new ResourceWheel())
  await core.addResource(new ResourceScene())
  await core.addResource(new ResourceIcons())
  await core.addResource(new ResourceTextures())
  await core.addResource(new ResourceResources())
  await core.addResource(new ResourceMap(128, 128))
  await core.addResource(new ResourceClock())
  await core.addResource(new ResourceSelection())
  await core.addResource(new ResourcePlacement())
  await core.addResource(
    new ResourcePlayers([
      [1, { nickname: 'stackdumper', color: 0x1b9cfc }],
      [2, { nickname: 'ololo', color: 0xfc427b }],
    ]),
  )

  // add systems
  core.addSystem(new SystemVelocity())
  core.addSystem(new SystemProduction())
  core.addSystem(new SystemRenderMap())
  core.addSystem(new SystemUIResources())
  core.addSystem(new SystemNavigation())
  core.addSystem(new SystemRender())
  core.addSystem(new SystemSelection())
  core.addSystem(new SystemOrderMove())
  core.addSystem(new SystemOrderBuild())
  core.addSystem(new SystemFollowOrderMove())
  core.addSystem(new SystemFollowOrderBuild())
  core.addSystem(new SystemFollowOrderProduce())
  core.addSystem(new SystemRenderOrders())
  core.addSystem(new SystemRenderIcons())
  core.addSystem(new SystemUIBuildOptions())
  core.addSystem(new SystemUIProductionOptions())
  core.addSystem(new SystemRenderPlacement())

  return core
}

window.addEventListener('load', async () => {
  const core = await createCore()

  // add commanders
  const players = core.getResource(ResourcePlayers)

  for (const playerID of players.keys()) {
    const commander = core.addEntity(entities.commander.build(playerID))

    core
      .getComponent(ComponentPosition)
      .set(commander, new ComponentPosition(64 * 16, 64 * 16))
  }

  // start game loop
  const clock = core.getResource(ResourceClock)

  PIXI.Ticker.shared.add((dt) => {
    clock.dt = dt

    core.dispatch()
  })
})
