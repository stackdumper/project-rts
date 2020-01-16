import fs from 'fs'
import { Core, CoreEvent, Resource } from '.'
import { System } from './system'
import { Entity } from './entity'

// create mocks
class MockResource extends Resource {
  initialize = jest.fn()
}

class MockSystem extends System {
  initialize = jest.fn()
  update = jest.fn()
}

class MockEntity extends Entity {
  initialize = jest.fn()
}

// create mock event listeners
const mockEvents = Object.values(CoreEvent).reduce(
  (acc, cur) => ({ ...acc, [cur]: jest.fn() }),
  {} as Record<CoreEvent, jest.Mock>,
)

// measures function execution time
const measure = (fn: () => any, numSamples = 10) => {
  const getSample = () => {
    const start = process.hrtime()

    fn()

    const end = process.hrtime(start)

    return end[0] * 1000 + end[1] / 1000000
  }

  const samples = Array.from({ length: numSamples + 2 })
    .map(() => getSample())
    .splice(2)

  return samples.reduce((acc, cur) => acc + cur, 0.0) / numSamples
}

// run tests
describe('Core', () => {
  const core = new Core()

  // add mock event listeners
  Object.values(CoreEvent).forEach((event) => {
    // @ts-ignore
    core.events.addListener(event, mockEvents[event])
  })

  describe('resources', () => {
    // create mock resource instance
    const resource = new MockResource()

    it('add resource', () => {
      // add resource
      core.addResource(resource)

      // check if resource was initialized
      expect(resource.initialize).toBeCalledWith(core)

      // check if event was called
      expect(mockEvents[CoreEvent.AddResource]).toBeCalledWith(resource)
    })

    it('get resource', () => {
      const r = core.getResource(MockResource)

      expect(r).toEqual(resource)
    })

    it('get nonexistent resource', () => {
      class NonexistentResource extends Resource {}

      const f = () => core.getResource(NonexistentResource)

      expect(f).toThrow()
    })

    it('perf', () => {
      const elapsed = measure(() => {
        for (let i = 0; i < 100000; i++) {
          core.getResource(MockResource)
        }
      }, 10)

      fs.appendFileSync(
        `/tmp/project-rts-perf-resource.txt`,
        `${new Date(Date.now()).toISOString()}: ${elapsed}\n`,
      )

      // expected <= 1.0
      console.info('[resources/perf]', elapsed)
    })
  })

  describe('systems', () => {
    const system = new MockSystem()

    it('add system', () => {
      core.addSystem(system)

      // check if system was initialized
      expect(system.initialize).toBeCalledWith(core)

      // check if event was called
      expect(mockEvents[CoreEvent.AddSystem]).toBeCalledWith(system)
    })

    it('update', () => {
      core.update()

      expect(system.update).toBeCalledWith(core)

      // check if events were called
      expect(mockEvents[CoreEvent.StartUpdate]).toBeCalled()
      expect(mockEvents[CoreEvent.EndUpdate]).toBeCalled()
    })

    it('perf', () => {
      const elapsed = measure(() => {
        for (let i = 0; i < 10000; i++) {
          core.update()
        }
      }, 10)

      fs.appendFileSync(
        `/tmp/project-rts-perf-core.txt`,
        `${new Date(Date.now()).toISOString()}: ${elapsed}\n`,
      )

      // expected <= 15.0
      console.info('[core/perf]', elapsed)
    })
  })

  describe('entities', () => {
    const entity = new MockEntity()

    it('add entity', () => {
      core.addEntity(entity)

      // check if entity was initialized
      expect(entity.initialize).toBeCalledWith(core)

      // check if event was called
      expect(mockEvents[CoreEvent.AddEntity]).toBeCalledWith(entity)
    })

    it('access entity', () => {
      expect(core.entities.has(entity.id)).toEqual(true)
      expect(core.entities.get(entity.id)).toEqual(entity)
      expect(core.entities.delete(entity.id)).toEqual(true)
      expect(core.entities.has(entity.id)).toEqual(false)
    })
  })
})
