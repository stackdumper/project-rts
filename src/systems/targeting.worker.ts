import Quadtree, { QuadtreeItem } from 'quadtree-lib'

const tree = new Quadtree({
  width: 9096,
  height: 9096,
  maxElements: 16,
})

type Item = {
  entity: number

  x: number
  y: number
  p: number
  r: number

  rMinX: number
  rMinY: number
  rMaxX: number
  rMaxY: number

  width: number
  height: number
}

// skip comparison with self
const comparator = (a: Item, b: Item) => {
  if (a.entity === b.entity || a.p === b.p) return false

  return b.x <= a.rMaxX && b.x >= a.rMinX && b.y <= a.rMaxY && b.y >= a.rMinY
}

self.addEventListener('message', (message) => {
  const data = message.data.data as Float32Array

  // clear previous tree
  tree.clear()

  // calculate items
  let items = new Set<Item>()
  for (let i = 0; i < data.length / 5; i++) {
    const o = i * 5

    const entity = data[o]

    const x = data[o + 1]
    const y = data[o + 2]
    const p = data[o + 3]
    const r = data[o + 4]

    items.add({
      entity,

      x,
      y,
      p,
      r,

      rMinX: x - r,
      rMinY: y - r,
      rMaxX: x + r,
      rMaxY: y + r,

      width: r ? r * 2 : 32,
      height: r ? r * 2 : 32,
    })
  }

  // rebuild tree
  for (const item of items) {
    tree.push(item)
  }

  // get available targets
  const targetsArr = new Array<[number, number, number]>()

  for (const item of items) {
    // @ts-ignore get targets
    const targets = tree.colliding(item, comparator)

    // calculate distance to item
    const targetDistances = targets.map((t) => {
      const distance = Math.abs(
        Math.sqrt(Math.pow(t.x - item.x, 2) + Math.pow(t.y - item.y, 2)),
      )

      return [t.entity, distance]
    })

    // filter only in range
    const filteredTargetDistances = targetDistances.filter((t) => t[1] < item.r)

    // sort by distance
    const sortedTargetDistances = filteredTargetDistances.sort((a, b) => a[1] - b[1])

    // get nearest target
    const nearestTarget = sortedTargetDistances[0]

    if (nearestTarget) {
      targetsArr.push([item.entity, nearestTarget[0], nearestTarget[1]])
    } else {
      targetsArr.push([item.entity, 0, 0])
    }
  }

  // build typed array
  const targetsTypedArray = Float32Array.from(targetsArr.flat())

  // @ts-ignore
  self.postMessage({ targets: targetsTypedArray }, [targetsTypedArray.buffer])
})
