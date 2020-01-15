import { Resource } from '~/core'

export class ResourceWheel extends Resource {
  public x = 0.0
  public y = 0.0

  public initialize() {
    window.addEventListener('wheel', (e) => {
      this.x += e.deltaX * 0.001
      this.y += e.deltaY * 0.001
    })
  }
}
