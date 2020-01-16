import { Resource } from '~/core'

export class ResourceWheel extends Resource {
  public deltaX = 0.0
  public deltaY = 0.0

  public initialize() {
    window.addEventListener('wheel', (e) => {
      console.log(e.deltaY)

      this.deltaX = e.deltaX
      this.deltaY = e.deltaY
    })
  }
}
