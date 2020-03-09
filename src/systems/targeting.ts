import { System, Core, ComponentStorage } from '~/core'
import {
  ComponentPosition,
  ComponentWeaponry,
  ComponentHealth,
  ComponentOwnership,
  ComponentTarget,
  ComponentDraft,
  ComponentRigid,
} from '~/components'
import { WorkerPool } from '~/utils'

/**
 * SystemTargeting is responsible for targeting hostile entities.
 */
export class SystemTargeting extends System {
  static id = 'targeting'
  static query = {
    core: false,
    components: [
      ComponentWeaponry,
      ComponentHealth,
      ComponentOwnership,
      ComponentPosition,
      ComponentRigid,
    ],
    resources: [],
  }

  private workers = new WorkerPool(
    // @ts-ignore
    Array.from({ length: navigator.hardwareConcurrency / 2 }).map(
      () => new Worker('./targeting.worker.ts'),
    ),
  )

  public initialize(core: Core) {
    const Target = core.getComponent(ComponentTarget)

    this.workers.addEventListener('message', (e: MessageEvent) => {
      const targets = e.data.targets as Uint32Array

      for (let i = 0; i < targets.length / 3; i += 1) {
        const o = i * 3

        const entity = targets[o]
        const targetEntity = targets[o + 1]
        const targetDistance = targets[o + 2]

        const target = Target.get(entity)

        if (target) {
          if (targetEntity) {
            target.target = targetEntity
            target.distance = targetDistance
          } else {
            target.target = undefined
            target.distance = undefined
          }
        }
      }
    })
  }

  public dispatch(
    core: never,
    [Weaponry, Health, Ownership, Position, Rigid]: [
      ComponentStorage<ComponentWeaponry>,
      ComponentStorage<ComponentHealth>,
      ComponentStorage<ComponentOwnership>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentRigid>,
    ],
    []: [],
  ) {
    if (this.workers.available) {
      const entities = Array.from(
        ComponentStorage.join(Position, Ownership, Rigid).keys(),
      )

      // [p1x, p1y, w1r, p2x, p2y, w2r, ...]
      const data = new Float32Array(entities.length * 5)

      for (let i = 0; i < entities.length; i += 1) {
        const entity = entities[i]

        const { x, y } = Position.get(entity)!
        const { playerID: p } = Ownership.get(entity)!
        const { range = 1 } = Weaponry.get(entity) || {}

        const o = i * 5

        data[o] = entity
        data[o + 1] = x
        data[o + 2] = y
        data[o + 3] = p
        data[o + 4] = range
      }

      this.workers.postMessage({ data }, [data.buffer])
    }
  }
}
