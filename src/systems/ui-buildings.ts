import { System, Core, Entity, EntityBuilder } from '~/core'
import { ResourceSelection, ResourceSelectionEvent, ResourcePlacement } from '~/resources'
import { ComponentUI, ComponentOwnership } from '~/components'

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
      if (!ui) return

      const ownership = entity.components.get(ComponentOwnership)
      if (!ownership) return

      // render each ui option in bottom menu
      ui.buildings.forEach((builder) => {
        const element = this.createElement(builder)

        element.onclick = () => {
          builder.components.get(ComponentOwnership).playerID = ownership.playerID
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
