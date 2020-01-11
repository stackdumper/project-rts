import { Core } from './core'
import { SystemVelocity, SystemRender } from './systems'
import { EntityCommander } from './entities'

window.addEventListener('load', () => {
  const core = new Core()

  // add systems
  core.addSystem(new SystemVelocity())
  core.addSystem(
    new SystemRender({ view: document.getElementById('root') as HTMLCanvasElement }),
  )

  // add entities with random positions and velocities
  for (let i = 0; i < 1000; i++) {
    core.addEntity(
      new EntityCommander(
        [Math.random() * 100, Math.random() * 100],
        [Math.random() * 2, Math.random() * 2],
      ),
    )
  }

  // start game loop
  setInterval(() => {
    core.update()
  }, 1000 / 60)
})
