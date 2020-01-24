import { Resource } from '~/core'

export class ResourceKeyboard extends Resource {
  static id = 'keyboard'

  public pressed = new Set<number>()

  public initialize() {
    window.addEventListener('keydown', (e) => this.pressed.add(e.keyCode))
    window.addEventListener('keyup', (e) => this.pressed.delete(e.keyCode))
  }
}
