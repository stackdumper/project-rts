import { System, Entity, ComponentStorage } from '~/core'
import { ComponentProductionOptions, ComponentOrders } from '~/components'
import { ResourceSelection, ResourceKeyboard } from '~/resources'
import { EntityTemplate } from '~/utils'

/**
 * SystemUIProductionOptions is responsible for displaying production options for entities (e.g. factories).
 */
export class SystemUIProductionOptions extends System {
  static id = 'ui-production-options'
  static query = {
    core: false,
    components: [ComponentProductionOptions, ComponentOrders],
    resources: [ResourceSelection, ResourceKeyboard],
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
    [selection, keyboard]: [ResourceSelection, ResourceKeyboard],
  ) {
    const [entity] = Array.from(selection)

    // clear
    if (
      (this.renderedEntity && !entity) ||
      (this.renderedEntity && this.renderedEntity !== entity)
    ) {
      this.renderedEntity = undefined
    }

    // render
    if (!this.renderedEntity && entity) {
      const productionOptions = ProductionOptions.get(entity)
      if (!productionOptions) return

      // clear container
      this.container.innerText = ''

      for (const template of productionOptions.templates) {
        const element = this.createElement(template)

        element.onclick = () => {
          const times = keyboard.pressed.has(16) ? 10 : 1

          for (let _ = 0; _ < times; _++) {
            Orders.get(entity)!.push({
              action: 'produce',
              template,
              mass: 0,
              energy: 0,
              percentage: 0,
            })
          }
        }

        this.container.appendChild(element)
      }

      this.renderedEntity = entity
    }
  }
}
