import { System, Core } from '~/core'
import { ResourceResources } from '~/resources'

/**
 * SystemRenderResources is responsible for showing resources in the top left menu.
 */
export class SystemRenderResources extends System {
  static id = 'velocity'

  private containers = {
    energy: document.getElementById('resource-energy')!,
    mass: document.getElementById('resource-mass')!,
  }

  public update(core: Core) {
    const resources = core.getResource(ResourceResources) as ResourceResources

    this.containers.energy.innerHTML = resources.energy.toFixed(2) + ' energy'
    this.containers.mass.innerHTML = resources.mass.toFixed(2) + ' mass'
  }
}
