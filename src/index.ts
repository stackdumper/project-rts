import { Core } from './core'
import { ResourceClock } from './resources'
import { SystemVelocity, SystemRender, SystemStats } from './systems'
import { EntityCommander } from './entities'

window.addEventListener('load', () => {
  const core = new Core()

  // add resources
  core.addResource(new ResourceClock(1000 / 60))

  // add systems
  core.addSystem(new SystemVelocity())
  core.addSystem(
    new SystemRender({ view: document.getElementById('root') as HTMLCanvasElement }),
  )
  core.addSystem(new SystemStats())

  // add entities with random positions and velocities
  for (let i = 0; i < 1000; i++) {
    setTimeout(() => {
      core.addEntity(
        new EntityCommander(
          [Math.random() * 100, Math.random() * 100],
          [Math.random() * 2, Math.random() * 2],
        ),
      )
    }, 1 * i)
  }

  // start game loop
  setInterval(() => {
    core.update()
  }, 1000 / 60)
})
