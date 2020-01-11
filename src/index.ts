import { Core } from './core'
import { SystemVelocity, SystemRender, SystemStats } from './systems'
import { EntityCommander } from './entities'
import { ResourceClock } from './resources'

window.addEventListener('load', () => {
  const core = new Core()

  // add resources
  core.addResource(new ResourceClock(1000 / 60))

  // add systems
  core.addSystem(new SystemStats())
  core.addSystem(new SystemVelocity())
  core.addSystem(
    new SystemRender({ view: document.getElementById('root') as HTMLCanvasElement }),
  )

  // add entities with random positions and velocities
  for (let i = 0; i < 1000; i++) {
    setTimeout(() => {
      core.addEntity(
        new EntityCommander(
          [Math.random() * 100, Math.random() * 100],
          [Math.random() * 2, Math.random() * 2],
        ),
      )
    }, 3 * i)
  }

  // start game loop
  setInterval(() => {
    core.update()
  }, 1000 / 60)
})
