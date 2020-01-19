import { System, Core, Entity, EntityBuilder } from '~/core'
import { ResourcePlacement, ResourceCursor, ResourceScene } from '~/resources'
import { ComponentPosition, ComponentGraphics, ComponentDimensions } from '~/components'

/**
 * SystemBuildShadow is responsible for showing build shadow.
 */
export class SystemPlacement extends System {
  private displayed?: Entity

  private getShadowEntity(builder: EntityBuilder) {
    const shadowEntity = new Entity()

    const position = builder.components.get(ComponentPosition)
    if (position) {
      shadowEntity.components.add(new ComponentPosition(position.x, position.y))
    }

    const graphics = builder.components.get(ComponentGraphics)
    if (graphics) {
      shadowEntity.components.add(
        new ComponentGraphics(graphics.texture, { ...graphics.options }),
      )
    }

    const dimensions = builder.components.get(ComponentDimensions)
    if (dimensions) {
      shadowEntity.components.add(
        new ComponentDimensions(dimensions.width, dimensions.height),
      )
    }

    return shadowEntity
  }

  public update(core: Core) {
    const scene = core.getResource(ResourceScene)
    const placement = core.getResource(ResourcePlacement)
    const cursor = core.getResource(ResourceCursor)

    // add shadow entity
    if (!this.displayed && placement.builder) {
      this.displayed = this.getShadowEntity(placement.builder)

      core.addEntity(this.displayed)
    }

    // update shadow entity position
    if (this.displayed) {
      const position = this.displayed.components.get(ComponentPosition)

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
      const position = placement.builder!.components.get(ComponentPosition)

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
      core.addEntity(placement.builder!.build())

      // remove shadow entity from scene
      core.removeEntity(this.displayed)

      // clean queue and displayed
      placement.builder = undefined
      this.displayed = undefined
    }
  }
}
