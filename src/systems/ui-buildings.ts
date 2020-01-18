import { System, Core, Entity } from '~/core'
import { ResourceSelection, ResourceSelectionEvent, ResourcePlacement } from '~/resources'
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

    element.textContent = building.title
    element.className = 'building-cell'

    return element
  }

  private onClick = (placement: ResourcePlacement, building: ComponentUIBuilding) => {
    placement.entity = building.create()
  }

  public initialize(core: Core) {
    const queue = core.getResource(ResourcePlacement) as ResourcePlacement
    const selection = core.getResource(ResourceSelection) as ResourceSelection

    // render ui when entity is selected
    selection.events.on(ResourceSelectionEvent.EntitySelected, (entity: Entity) => {
      const ui = entity.components.get(ComponentUI) as ComponentUI

      ui?.buildings.forEach((building) => {
        const element = this.createElement(building)

        element.onclick = this.onClick.bind(this, queue, building)

        this.container.appendChild(element)
      })
    })

    // clear ui when entity is deselected
    selection.events.on(ResourceSelectionEvent.EntityDeselected, (entity: Entity) => {
      this.container.innerHTML = ''
    })
  }
}
