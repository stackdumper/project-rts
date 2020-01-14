import { System, Core, Entity } from '~/core'
import { ResourceSelection, ResourceSelectionEvent } from '~/resources'
import { ComponentUI, ComponentUIBuilding } from '~/components'

/**
 * SystemUIBuildings is responsible for displaying selected unit build options in the bottom menu.
 */
export class SystemUIBuildings extends System {
  private container: HTMLDivElement = document.getElementById(
    'bottom-menu',
  )! as HTMLDivElement

  // create new building-cell html element
  private createElement = (building: ComponentUIBuilding) => {
    const element = document.createElement('div')

    element.textContent = building.name
    element.className = 'building-cell'
    element.onclick = () => {
      console.log('click', building.name)
    }

    return element
  }

  public initialize(core: Core) {
    const selection = core.getResource(ResourceSelection) as ResourceSelection

    // render ui when entity is selected
    selection.events.on(ResourceSelectionEvent.EntitySelected, (entity: Entity) => {
      const ui = entity.components.get(ComponentUI.name) as ComponentUI

      ui?.buildings.map(this.createElement).forEach((element) => {
        this.container.appendChild(element)
      })
    })

    // clear ui when entity is deselected
    selection.events.on(ResourceSelectionEvent.EntityDeselected, (entity: Entity) => {
      this.container.innerHTML = ''
    })
  }
}
