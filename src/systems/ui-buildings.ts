import { System, Core, Entity } from '~/core'
import { ResourceSelection } from '~/resources'
import { ComponentUI, ComponentUIBuilding } from '~/components'

/**
 * SystemUIBuildings is responsible for displaying selected unit build options in the bottom menu.
 */
export class SystemUIBuildings extends System {
  private container: HTMLDivElement = document.getElementById(
    'bottom-menu',
  )! as HTMLDivElement
  private renderedID: string = ''

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

  // create ui elements for entity
  private renderEntityUI = (entity: Entity) => {
    const ui = entity.components.get(ComponentUI.name) as ComponentUI

    if (ui) {
      this.renderedID = entity.id
      ui.buildings.map(this.createElement).forEach((element) => {
        this.container.appendChild(element)
      })
    }
  }

  // clear rendered contents
  private clearUI = () => {
    this.renderedID = ''
    this.container.innerHTML = ''
  }

  // if some entity is selected, render it's ui
  public update(core: Core) {
    const selection = core.getResource(ResourceSelection) as ResourceSelection
    const [entity] = selection.selected

    if (entity && this.renderedID !== entity.id) {
      this.clearUI()
      this.renderEntityUI(entity)
    } else if (!entity && this.container.innerHTML !== '') {
      this.clearUI()
    }
  }
}
