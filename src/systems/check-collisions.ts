import { System, ComponentStorage, Core } from '~/core'
import { ComponentPosition, ComponentDimensions, ComponentCollidable } from '~/components'
import { ResourceCollisions } from '~/resources'
import { WorkerPool } from '~/utils'

/**
 * SystemCheckCollisions is responsible for checking collisions between entities.
 */
export class SystemCheckCollisions extends System {
  static id = 'check-collisions'
  static query = {
    core: false,
    components: [ComponentCollidable, ComponentPosition, ComponentDimensions],
    resources: [ResourceCollisions],
  }

  private workers = new WorkerPool(
    // @ts-ignore
    Array.from({ length: navigator.hardwareConcurrency / 2 }).map(
      () => new Worker('./check-collisions.worker.ts'),
    ),
  )

  private indexes = new Map<number, string>()
  private collisions?: Map<number, number[]>

  constructor() {
    super()

    // @ts-ignore
    this.workers.addEventListener('message', (message) => {
      this.collisions = message.data
    })
  }

  private send(
    components: [
      ComponentStorage<ComponentCollidable>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
    ],
  ) {
    // this.worker.postMessage(ComponentStorage.join(Position, Dimensions))
    this.indexes.clear()

    // collect data
    const data = ComponentStorage.join(...components)

    // create typed arrays for data
    const pos = new Float64Array(data.size * 2)
    const dim = new Float64Array(data.size * 2)

    for (const [entity, [_, position, dimensions]] of data) {
      // get offset index
      const index = this.indexes.size

      // save index-entity relation
      this.indexes.set(index * 2, entity)

      // store positions
      pos[index * 2] = position.x
      pos[index * 2 + 1] = position.y

      // store dimensions
      dim[index * 2] = dimensions.width
      dim[index * 2 + 1] = dimensions.height
    }

    this.workers.postMessage({ pos, dim }, [pos.buffer, dim.buffer])
  }

  public dispatch(
    _: never,
    components: [
      ComponentStorage<ComponentCollidable>,
      ComponentStorage<ComponentPosition>,
      ComponentStorage<ComponentDimensions>,
    ],
    [collisions]: [ResourceCollisions],
  ) {
    // save collisions to resource
    if (this.collisions) {
      collisions.clear()

      for (const [index, colls] of this.collisions.entries()) {
        if (colls.length) {
          const source = this.indexes.get(index)!

          const targets = colls.map((index) => this.indexes.get(index)!)

          collisions.set(source, targets)
        }
      }

      this.collisions = undefined
      this.indexes.clear()
    }

    // send data for detecting collisions to worker
    if (this.workers.available) {
      this.send(components)
    } else {
      console.log('non available')
    }
  }
}

// // debug
// for (const [entity, targets] of collisions.entries()) {
//   const entityOwnership = Ownership.get(entity)
//   const entityPosition = Position.get(entity)

//   for (const target of targets) {
//     const targetOwnership = Ownership.get(target)
//     const targetPosition = Position.get(target)

//     if (entityOwnership?.playerID === targetOwnership?.playerID) continue

//     scene.containers.map.addChild(
//       new PIXI.Graphics()
//         .moveTo(entityPosition?.x || 0, entityPosition?.y || 0)
//         .lineStyle(1, 0xffffff, 0.2)
//         .lineTo(targetPosition?.x || 0, targetPosition?.y || 0)
//         .endFill(),
//     )
//   }
// }
