import { Resource } from '~/core'

export class ResourceCursor extends Resource {
  public x = 0.0
  public y = 0.0
  public clicked = false

  public initialize() {
    window.addEventListener('mousemove', (e) => {
      this.x = e.clientX
      this.y = e.clientY
    })

    window.addEventListener('mousedown', () => {
      this.clicked = true
    })

    window.addEventListener('mouseup', () => {
      this.clicked = false
    })
  }
}
