import { System, Entity, ComponentStorage } from '~/core'
import { ComponentBuildOptions } from '~/components'
import { ResourceSelection, ResourcePlacement } from '~/resources'
import { EntityTemplate } from '~/utils'

/**
 * SystemUIBuildOptions is responsible for displaying build options of a selected entity.
 */
export class SystemUIBuildOptions extends System {
  static id = 'ui-build-options'
  static query = {
    core: false,
    components: [ComponentBuildOptions],
    resources: [ResourceSelection, ResourcePlacement],
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
    [BuildOptions]: [ComponentStorage<ComponentBuildOptions>],
    [selection, placement]: [ResourceSelection, ResourcePlacement],
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
      const buildOptions = BuildOptions.get(entity)
      if (!buildOptions) return

      // clear container
      this.container.innerText = ''

      for (const template of buildOptions.templates) {
        const element = this.createElement(template)

        element.onclick = () => {
          placement.template = template
          placement.builder = entity
        }

        this.container.appendChild(element)
      }

      this.renderedEntity = entity
    }
  }
}
