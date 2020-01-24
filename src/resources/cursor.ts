import { Resource } from '~/core'
import { Vector2 } from '~/math'

export class ResourceCursor extends Resource {
  static id = 'cursor'

  public position: Vector2 = new Vector2(0.0, 0.0)

  public initialize() {
    window.addEventListener('mousemove', (e) => {
      this.position.set(e.clientX, e.clientY)
    })
  }
}
