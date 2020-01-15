import { Resource } from '~/core'

export class ResourceCursor extends Resource {
  public x = 0.0
  public y = 0.0

  public initialize() {
    window.addEventListener('mousemove', (e) => {
      this.x = e.clientX
      this.y = e.clientY
    })
  }
}
