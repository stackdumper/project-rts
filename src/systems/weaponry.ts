import { System, Core, Entity } from '~/core'
import {
  ComponentWeaponry,
  ComponentOwnership,
  ComponentProjectile,
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentDimensions,
  ComponentHealth,
} from '~/components'
import { ResourceClock } from '~/resources'
import { Vector2 } from '~/math'

/**
 * SystemWeaponry is responsible for targeting and shooting.
 */
export class SystemWeaponry extends System {
  private getProjectile(
    sourcePosition: ComponentPosition,
    targetPosition: ComponentPosition,
    sourceWeaponry: ComponentWeaponry,
    ownership: ComponentOwnership,
  ) {
    // create projectile
    const projectile = new Entity()
    projectile.components.add(new ComponentPosition(sourcePosition.x, sourcePosition.y))
    projectile.components.add(
      new ComponentGraphics('projectile', { scaleMode: 'LINEAR' }),
    )
    projectile.components.add(
      new ComponentDimensions(sourceWeaponry.damage / 20, sourceWeaponry.damage / 20),
    )
    projectile.components.add(new ComponentOwnership(ownership.playerID))
    projectile.components.add(
      new ComponentProjectile(sourceWeaponry.speed, sourceWeaponry.damage),
    )

    // set attack vector
    const sourcePositionVec = new Vector2(sourcePosition.x, sourcePosition.y)
    const targetPositionVec = new Vector2(targetPosition.x, targetPosition.y)
    const velocity = targetPositionVec
      .sub(sourcePositionVec)
      .normalize()
      .multiplyScalar(sourceWeaponry.speed)

    projectile.components.add(new ComponentVelocity(velocity.x, velocity.y))

    return projectile
  }

  public update(core: Core) {
    const clock = core.getResource(ResourceClock)

    for (const entity of core.entities.values()) {
      // get weaponry
      const weaponry = entity.components.get(ComponentWeaponry)
      if (!weaponry) continue

      // check cooldown
      if (weaponry.cooldown > 0) {
        weaponry.cooldown -= (16.6 * clock.dt) / 1000
        continue
      }

      // get position
      const position = entity.components.get(ComponentPosition)
      if (!position) continue

      // get ownership
      const ownership = entity.components.get(ComponentOwnership)
      if (!ownership) continue

      // get nearest target in range
      const targets = Array.from(core.entities.values())
        .filter(
          (target) =>
            target.components.has(ComponentHealth) &&
            target.components.get(ComponentOwnership).playerID !== ownership.playerID,
        )
        .map((entity) => {
          const targetPosition = entity.components.get(ComponentPosition)

          const distance = new Vector2(position.x, position.y).distanceTo(
            new Vector2(targetPosition.x, targetPosition.y),
          )

          return { entity, distance }
        })
        .sort((a, b) => a.distance - b.distance)
        .filter((a) => a.distance < weaponry.range)

      const target = targets[0]?.entity
      if (!target) continue

      // get ownership and check if not an ally
      const targetOwnership = target.components.get(ComponentOwnership)
      if (!targetOwnership || targetOwnership.playerID === ownership.playerID) continue

      // get ownership and check if not an ally
      const targetPosition = target.components.get(ComponentPosition)
      if (!targetPosition) continue

      // create projectile
      const projectile = this.getProjectile(position, targetPosition, weaponry, ownership)

      // add projectile
      core.addEntity(projectile)

      // set cooldown
      weaponry.cooldown = weaponry.frequency
      continue
    }
  }
}
