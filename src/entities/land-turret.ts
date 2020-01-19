import { EntityBuilder } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentDimensions,
  ComponentSelectable,
  ComponentUI,
  ComponentOwnership,
  ComponentHealth,
  ComponentWeaponry,
} from '~/components'

export const landTurret = new EntityBuilder('Land turret')
  .withComponent(new ComponentOwnership(0))
  .withComponent(new ComponentHealth(1300))
  .withComponent(new ComponentWeaponry(50, 1 / 3, 10, 500))
  .withComponent(new ComponentPosition(0.0, 0.0))
  .withComponent(new ComponentVelocity(0.0, 0.0))
  .withComponent(new ComponentGraphics('land_turret'))
  .withComponent(new ComponentDimensions(25, 25))
  .withComponent(new ComponentSelectable())
  .withComponent(new ComponentUI([]))
