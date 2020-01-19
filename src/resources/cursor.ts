import { Resource } from '~/core'
import { Vector2 } from '~/math'

export class ResourceCursor extends Resource {
  public position: Vector2 = new Vector2(0.0, 0.0)
  public clicked: boolean = false

  public initialize() {
    window.addEventListener('mousemove', (e) => {
      this.position.set(e.clientX, e.clientY)
    })

    window.addEventListener('mousedown', () => {
      this.clicked = true
    })

    window.addEventListener('mouseup', () => {
      this.clicked = false
    })
  }
}
