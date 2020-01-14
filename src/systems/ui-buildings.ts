import { System, Core } from '~/core'
import { ResourceSelection } from '~/resources'
import { ComponentUI } from '~/components'

/**
 * SystemUIBuildings is responseible for displaying selected unit build options in the bottom menu.
 */
export class SystemUIBuildings extends System {
  private container = document.getElementById('bottom-menu')!

  private activeEntity: string = ''

  public update(core: Core) {
    const {
      selected: [entity],
    } = core.getResource(ResourceSelection) as ResourceSelection

    if (entity && this.activeEntity !== entity.id) {
      const ui = entity.components.get(ComponentUI.name) as ComponentUI

      if (ui) {
        this.container.innerHTML = ui.buildings
          .map((b) => `<div class="building-cell">${b.name}</div>`)
          .join('')

        this.activeEntity = entity.id
      }
    } else if (!entity && this.container.innerHTML !== '') {
      console.log('clear')
      this.activeEntity = ''

      this.container.innerHTML = ''
    }
  }
}
