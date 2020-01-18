import { System, Core, Entity } from '~/core'
import { ResourcePlacement, ResourceCursor, ResourceScene } from '~/resources'
import { ComponentPosition, ComponentGraphics } from '~/components'

/**
 * SystemBuildShadow is responsible for showing build shadow.
 */
export class SystemPlacement extends System {
  private displayed?: Entity

  private getShadowEntity(entity: Entity) {
    const shadowEntity = new Entity()

    // filter components, allow graphics and position
    for (const [key, value] of entity.components) {
      if (key === ComponentGraphics) {
        const graphics = value as ComponentGraphics

        const shadowGraphics = new ComponentGraphics(
          graphics.sprite.texture.clone(),
          graphics.sprite.width,
          graphics.sprite.height,
        )
        shadowGraphics.sprite.alpha = 0.75

        shadowEntity.components.set(key, shadowGraphics)
      }

      if (key === ComponentPosition) {
        const position = value as ComponentPosition

        shadowEntity.components.set(key, new ComponentPosition(position.x, position.y))
      }
    }

    return shadowEntity
  }

  public update(core: Core) {
    const scene = core.getResource(ResourceScene) as ResourceScene
    const placement = core.getResource(ResourcePlacement) as ResourcePlacement
    const cursor = core.getResource(ResourceCursor) as ResourceCursor

    // add shadow entity
    if (!this.displayed && placement.entity) {
      placement.entity.initialize(core)

      this.displayed = this.getShadowEntity(placement.entity)

      core.addEntity(this.displayed)
    }

    // update shadow entity position
    if (this.displayed) {
      const graphics = this.displayed.components.get(
        ComponentGraphics,
      ) as ComponentGraphics
      const position = this.displayed.components.get(
        ComponentPosition,
      ) as ComponentPosition

      const pos = scene.viewport.toLocal(cursor.position)

      position.x = pos.x - graphics.sprite.width / 2
      position.y = pos.y - graphics.sprite.height / 2
    }

    // remove shadow entity and add real entity once clicked
    if (this.displayed && cursor.clicked) {
      const graphics = placement.entity!.components.get(
        ComponentGraphics,
      ) as ComponentGraphics
      const position = placement.entity!.components.get(
        ComponentPosition,
      ) as ComponentPosition

      // set real entity position to cursor
      const nextPosition = scene.viewport.toLocal(cursor.position)
      position.x = nextPosition.x - graphics.sprite.width / 2
      position.y = nextPosition.y - graphics.sprite.width / 2

      // add real entity to scene
      core.addEntity(placement.entity!)

      // remove shadow entity from scene
      core.removeEntity(this.displayed)

      // clean queue and displayed
      placement.entity = undefined
      this.displayed = undefined
    }
  }
}
