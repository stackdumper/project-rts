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
    // clear
    if (
      (this.renderedEntity && !selection.entity) ||
      (this.renderedEntity && this.renderedEntity !== selection.entity)
    ) {
      this.renderedEntity = undefined
      this.container.innerText = ''
    }

    // render
    if (!this.renderedEntity && selection.entity) {
      this.renderedEntity = selection.entity

      const buildOptions = BuildOptions.get(selection.entity)
      if (buildOptions) {
        for (const template of buildOptions.templates) {
          const element = this.createElement(template)

          element.onclick = () => {
            placement.template = template
            placement.builder = selection.entity
          }

          this.container.appendChild(element)
        }
      }
    }
  }
}
