import { System, Entity, ComponentStorage } from '~/core'
import { ComponentProductionOptions, ComponentOrders } from '~/components'
import { ResourceSelection } from '~/resources'
import { EntityTemplate } from '~/utils'

/**
 * SystemUIProductionOptions is responsible for displaying production options for entities (e.g. factories).
 */
export class SystemUIProductionOptions extends System {
  static id = 'ui-production-options'
  static query = {
    core: false,
    components: [ComponentProductionOptions, ComponentOrders],
    resources: [ResourceSelection],
  }

  private container: HTMLDivElement = document.getElementById(
    'bottom-menu',
  )! as HTMLDivElement
  private renderedEntity?: Entity

  // create new building-cell html element
  private createElement = (template: EntityTemplate) => {
    const element = document.createElement('div')

    element.textContent = template.name
    element.className = 'building-cell'

    return element
  }

  public dispatch(
    _: never,
    [ProductionOptions, Orders]: [
      ComponentStorage<ComponentProductionOptions>,
      ComponentStorage<ComponentOrders>,
    ],
    [selection]: [ResourceSelection],
  ) {
    // clear
    if (
      (this.renderedEntity && !selection.entity) ||
      (this.renderedEntity && this.renderedEntity !== selection.entity)
    ) {
      this.renderedEntity = undefined
    }

    // render
    if (!this.renderedEntity && selection.entity) {
      const productionOptions = ProductionOptions.get(selection.entity)
      if (!productionOptions) return

      // clear container
      this.container.innerText = ''

      for (const template of productionOptions.templates) {
        const element = this.createElement(template)

        element.onclick = () => {
          Orders.get(selection.entity!)!.push({
            action: 'produce',
            template,
          })
        }

        this.container.appendChild(element)
      }

      this.renderedEntity = selection.entity
    }
  }
}
