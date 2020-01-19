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
import { landFactory } from './land-factory'
import { landTurret } from './land-turret'

export const commander = new EntityBuilder('Commander')
  .withComponent(new ComponentOwnership(0))
  .withComponent(new ComponentHealth(10000))
  .withComponent(new ComponentWeaponry(100, 1, 8, 500))
  .withComponent(new ComponentPosition(0.0, 0.0))
  .withComponent(new ComponentVelocity(0.0, 0.0))
  .withComponent(new ComponentGraphics('commander', { scale: 1.4 }))
  .withComponent(new ComponentDimensions(32, 32))
  .withComponent(new ComponentSelectable())
  .withComponent(new ComponentUI([landFactory, landTurret]))
