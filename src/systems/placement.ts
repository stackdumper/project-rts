import { System, Core, Entity } from '~/core'
import { ResourcePlacement, ResourceCursor, ResourceScene } from '~/resources'
import { ComponentPosition, ComponentGraphics, ComponentDimensions } from '~/components'

/**
 * SystemBuildShadow is responsible for showing build shadow.
 */
export class SystemPlacement extends System {
  private displayed?: Entity

  private getShadowEntity(entity: Entity) {
    const shadowEntity = new Entity()

    // filter components
    for (const [key, value] of entity.components) {
      // allow position
      if (key === ComponentPosition) {
        const position = value as ComponentPosition

        shadowEntity.components.set(key, new ComponentPosition(position.x, position.y))
      }

      // allow graphics
      if (key === ComponentGraphics) {
        const graphics = value as ComponentGraphics

        shadowEntity.components.set(key, new ComponentGraphics(graphics.texture, 0.75))
      }

      // allow dimensions
      if (key === ComponentDimensions) {
        const dimensions = value as ComponentDimensions

        shadowEntity.components.set(
          key,
          new ComponentDimensions(dimensions.width, dimensions.height),
        )
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
      const position = this.displayed.components.get(
        ComponentPosition,
      ) as ComponentPosition

      // transform on-screen cursor coordinates to local viewport coordinates
      // @ts-ignore
      const { x: localX, y: localY } = scene.viewport.toLocal({
        x: cursor.position.x,
        y: cursor.position.y,
      })

      position.x = localX
      position.y = localY
    }

    // remove shadow entity and add real entity once clicked
    if (this.displayed && cursor.clicked) {
      const graphics = placement.entity!.components.get(
        ComponentGraphics,
      ) as ComponentGraphics
      const position = placement.entity!.components.get(
        ComponentPosition,
      ) as ComponentPosition

      // transform on-screen cursor coordinates to local viewport coordinates
      // @ts-ignore
      const { x: localX, y: localY } = scene.viewport.toLocal({
        x: cursor.position.x,
        y: cursor.position.y,
      })

      // set real entity position to cursor
      position.x = localX
      position.y = localY

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
