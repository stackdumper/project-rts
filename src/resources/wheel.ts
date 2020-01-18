import { Resource } from '~/core'

export class ResourceWheel extends Resource {
  public deltaX = 0.0
  public deltaY = 0.0

  public initialize() {
    window.addEventListener('wheel', (e) => {
      this.deltaX = e.deltaX
      this.deltaY = e.deltaY
    })
  }
}
