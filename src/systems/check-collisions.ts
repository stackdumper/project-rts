import { System, ComponentStorage } from '~/core'
import { ComponentPosition, ComponentDimensions, ComponentCollidable } from '~/components'
import { ResourceCollisions } from '~/resources'

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

  private worker = new Worker('./check-collisions.worker.ts')
  private indexes = new Map<number, string>()
  private collisions?: Map<number, number[]>
  private sent = false

  constructor() {
    super()

    this.worker.addEventListener('message', (message) => {
      this.sent = false

      this.collisions = message.data
    })
  }

  public dispatch(
    _: never,
    [Collidable, Position, Dimensions]: [
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
    if (!this.sent) {
      this.sent = true

      // this.worker.postMessage(ComponentStorage.join(Position, Dimensions))
      this.indexes.clear()

      const pos = new Float64Array(Position.size * 2)
      const dim = new Float64Array(Position.size * 2)

      for (const [entity, [_, position, dimensions]] of ComponentStorage.join(
        Collidable,
        Position,
        Dimensions,
      )) {
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

      this.worker.postMessage({ pos, dim }, [pos.buffer, dim.buffer])
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
