import Quadtree, { QuadtreeItem } from 'quadtree-lib'

interface TItem extends QuadtreeItem {
  i: number
  x: number
  y: number
  width: number
  height: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}

const tree = new Quadtree({
  width: 9096,
  height: 9096,
  maxElements: 16,
})
const collisions = new Map<number, number[]>()
const items = new Map<number, TItem>()

// skip comparison with self
const comparator = (a: TItem, b: TItem) => {
  if (a.i === b.i) return false

  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY
}

self.addEventListener('message', (message) => {
  const { pos, dim } = message.data as { pos: Float64Array; dim: Float64Array }

  // clear previous tree
  tree.clear()

  // clear previous collisions
  collisions.clear()

  // build items
  for (let i = 0; i < pos.length; i += 2) {
    const [x, y] = [pos[i], pos[i + 1]]
    const [width, height] = [dim[i], dim[i + 1]]

    const halfWidth = (width - 1) / 2
    const halfHeight = (height - 1) / 2

    items.set(i, {
      i,

      x,
      y,

      width,
      height,

      minX: x - halfWidth,
      minY: y - halfHeight,

      maxX: x + halfWidth,
      maxY: y + halfHeight,
    })
  }

  // rebuild tree
  for (let i = 0; i < pos.length; i += 2) {
    tree.push(items.get(i)!)
  }

  // detect and store collisions
  for (let i = 0; i < pos.length; i += 2) {
    // @ts-ignore
    const collided = tree.colliding(items.get(i)!, comparator)

    collisions.set(
      i,
      collided.map((t: any) => t.i),
    )
  }

  // @ts-ignore send results back
  self.postMessage(collisions)
})
