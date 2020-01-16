import * as PIXI from 'pixi.js'
import { System, Core, Entity } from '~/core'
import { ResourceBuildQueue, ResourceCursor, ResourceScene } from '~/resources'
import { ComponentPosition, ComponentGraphics } from '~/components'

/**
 * SystemRenderBuildQueue is responsible for rendering build queue.
 */
export class SystemRenderBuildQueue extends System {
  private displayed?: Entity

  private getShadowEntity(entity: Entity) {
    const shadowEntity = new Entity()

    // filter components, allow graphics and position
    for (const [key, value] of entity.components) {
      if (key === ComponentGraphics) {
        const graphics = value as ComponentGraphics

        const shadowGraphics = new ComponentGraphics(graphics.sprite.clone())

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
    const queue = core.getResource(ResourceBuildQueue) as ResourceBuildQueue
    const cursor = core.getResource(ResourceCursor) as ResourceCursor

    // add shadow entity
    if (!this.displayed && queue.entity) {
      this.displayed = this.getShadowEntity(queue.entity)

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

      const pos = scene.viewport.toLocal(new PIXI.Point(cursor.x, cursor.y))

      position.x = pos.x - graphics.sprite.width / 2
      position.y = pos.y - graphics.sprite.height / 2
    }

    // remove shadow entity and add real entity once clicked
    if (this.displayed && cursor.clicked) {
      const graphics = queue.entity!.components.get(
        ComponentGraphics,
      ) as ComponentGraphics
      const position = queue.entity!.components.get(
        ComponentPosition,
      ) as ComponentPosition

      // set real entity position to cursor
      const nextPosition = scene.viewport.toLocal(new PIXI.Point(cursor.x, cursor.y))
      position.x = nextPosition.x - graphics.sprite.width / 2
      position.y = nextPosition.y - graphics.sprite.width / 2

      // add real entity to scene
      core.addEntity(queue.entity!)

      // remove shadow entity from scene
      core.removeEntity(this.displayed)

      // clean queue and displayed
      queue.entity = undefined
      this.displayed = undefined
    }

    // if entity was added to queue, add it's shadow to scene

    // update shadow's position

    // if clicked, add entity and remove shadow

    // if (!this.displayed && resource.entity) {
    //   console.log('add')

    //   const entity = this.createEntity()

    //   this.displayed = entity

    //   core.addEntity(entity)

    //   window.addEventListener('click', () => {
    //     console.log('remove')

    //     if (resource.entity) {
    //       core.removeEntity(entity)

    //       core.addEntity(resource.entity!)

    //       resource.entity = undefined
    //     }

    //     this.displayed = undefined
    //   })
    // }

    // if (this.displayed) {
    //   const graphics = this.displayed.components.get(
    //     ComponentGraphics,
    //   ) as ComponentGraphics
    //   const position = this.displayed.components.get(
    //     ComponentPosition,
    //   ) as ComponentPosition

    //   const pos = scene.viewport.toLocal(new PIXI.Point(cursor.x, cursor.y))

    //   position.x = pos.x - graphics.sprite.width / 2
    //   position.y = pos.y - graphics.sprite.height / 2
    // }
  }
}
