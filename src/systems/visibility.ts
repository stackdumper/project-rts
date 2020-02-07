import { System, Entity, ComponentStorage } from '~/core'
import { ComponentPosition, ComponentVelocity } from '~/components'
import { ResourceClock, ResourceScene } from '~/resources'

/**
 * SystemVisibility is responsible for controlling containers visibility depending on scale.
 */
export class SystemVisibility extends System {
  static id = 'visibility'
  static query = {
    core: false,
    components: [],
    resources: [ResourceScene],
  }

  public dispatch(_: never, []: [], [scene]: [ResourceScene]) {
    // health and progress containers
    if (scene.containers.viewport.scale.x < 0.5) {
      scene.containers.progress.visible = false
      scene.containers.health.visible = false
    } else {
      scene.containers.progress.visible = true
      scene.containers.health.visible = true
    }

    // land and ground containers
    if (scene.containers.viewport.scale.x < 0.2) {
      scene.containers.land.visible = false
      scene.containers.ground.visible = false
    } else {
      scene.containers.land.visible = true
      scene.containers.ground.visible = true
    }
  }
}
