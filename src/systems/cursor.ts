import { System, Core } from '~/core'
import { ResourceClock, ResourceCursor } from '~/resources'
import { ComponentPosition, ComponentVelocity } from '~/components'

/**
 * SystemCursor is used to update ResourceCursor when cursor moves.
 */
export class SystemCursor extends System {
  public initialize(core: Core) {
    const cursor = core.getResource(ResourceCursor) as ResourceCursor

    window.addEventListener('mousemove', (e) => {
      cursor.x = e.clientX
      cursor.y = e.clientY
    })
  }
}
