import { System, Core, Entity, EntityBuilder } from '~/core'
import { ResourceSelection, ResourceSelectionEvent, ResourcePlacement } from '~/resources'
import { ComponentUI } from '~/components'

/**
 * SystemUIBuildings is responsible for displaying selected unit build options in the bottom menu.
 */
export class SystemUIBuildings extends System {
  private container: HTMLDivElement = document.getElementById(
    'bottom-menu',
  )! as HTMLDivElement

  // create new building-cell html element
  private createElement = (builder: EntityBuilder) => {
    const element = document.createElement('div')

    element.textContent = builder?.name
    element.className = 'building-cell'

    return element
  }

  public initialize(core: Core) {
    const placement = core.getResource(ResourcePlacement)
    const selection = core.getResource(ResourceSelection)

    // render ui when entity is selected
    selection.events.on(ResourceSelectionEvent.EntitySelected, (entity: Entity) => {
      const ui = entity.components.get(ComponentUI)

      // render each ui option in bottom menu
      ui?.buildings.forEach((builder) => {
        const element = this.createElement(builder)

        element.onclick = () => {
          placement.builder = builder
        }

        this.container.appendChild(element)
      })
    })

    // clear ui when entity is deselected
    selection.events.on(ResourceSelectionEvent.EntityDeselected, (entity: Entity) => {
      this.container.innerHTML = ''
    })
  }
}
