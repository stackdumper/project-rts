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
  ComponentHealth,
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
  ResourceCollisions,
} from '~/resources'
import {
  SystemVelocity,
  SystemRenderMap,
  SystemProduction,
  SystemUIResources,
  SystemNavigation,
  SystemRenderTextures,
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
  SystemRenderHealth,
  SystemRenderProgress,
  SystemVisibility,
  SystemBuildQuadtree,
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
  core.addComponent(ComponentHealth)

  // add resources
  await core.addResource(new ResourceKeyboard())
  await core.addResource(new ResourceCursor())
  await core.addResource(new ResourceWheel())
  await core.addResource(new ResourceScene())
  await core.addResource(new ResourceIcons())
  await core.addResource(new ResourceTextures())
  await core.addResource(new ResourceResources([1, 2]))
  await core.addResource(new ResourceMap(64, 64))
  await core.addResource(new ResourceClock())
  await core.addResource(new ResourceSelection())
  await core.addResource(new ResourcePlacement())
  await core.addResource(new ResourceCollisions())
  await core.addResource(
    new ResourcePlayers(
      [
        [1, { nickname: 'stackdumper', color: 0x1b9cfc }],
        [2, { nickname: 'ololo', color: 0xfc427b }],
      ],
      1,
    ),
  )

  // add systems
  core.addSystem(new SystemVelocity())
  core.addSystem(new SystemBuildQuadtree())
  core.addSystem(new SystemVisibility())
  core.addSystem(new SystemProduction())
  core.addSystem(new SystemUIResources())
  core.addSystem(new SystemNavigation())
  core.addSystem(new SystemSelection())
  core.addSystem(new SystemOrderMove())
  core.addSystem(new SystemOrderBuild())
  core.addSystem(new SystemFollowOrderMove())
  core.addSystem(new SystemFollowOrderBuild())
  core.addSystem(new SystemFollowOrderProduce())
  core.addSystem(new SystemRenderMap())
  core.addSystem(new SystemRenderTextures())
  core.addSystem(new SystemRenderOrders())
  core.addSystem(new SystemRenderIcons())
  core.addSystem(new SystemRenderHealth())
  core.addSystem(new SystemRenderProgress())
  core.addSystem(new SystemRenderPlacement())
  core.addSystem(new SystemUIBuildOptions())
  core.addSystem(new SystemUIProductionOptions())

  return core
}

window.addEventListener('load', async () => {
  const core = await createCore()

  // // add commanders
  // const players = core.getResource(ResourcePlayers)
  // for (const playerID of players.keys()) {
  //   const commander = core.addEntity(entities.commander.build(playerID))

  //   core
  //     .getComponent(ComponentPosition)
  //     .set(commander, new ComponentPosition(64 * 16 + 64 * playerID, 64 * 16))
  // }

  const d = Array(32)
    .fill(0)
    .map((_, i) => i)

  for (const x of d) {
    for (const y of d) {
      const commander = core.addEntity(entities.commander.build(1))

      core
        .getComponent(ComponentPosition)
        .set(commander, new ComponentPosition(64 * 16 + 32 * x, 64 * 16 + 32 * y))
    }
  }

  // start game loop
  const clock = core.getResource(ResourceClock)

  PIXI.Ticker.shared.add((dt) => {
    clock.dt = dt

    core.dispatch()
  })
})

// const d = Array(32)
//   .fill(0)
//   .map((_, i) => i)

// for (const x of d) {
//   for (const y of d) {
//     const commander = core.addEntity(entities.commander.build(1))

//     core
//       .getComponent(ComponentPosition)
//       .set(commander, new ComponentPosition(64 * 16 + 32 * x, 64 * 16 + 32 * y))
//   }
// }
