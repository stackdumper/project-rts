import { EntityBuilder } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentDimensions,
  ComponentSelectable,
  ComponentUI,
} from '~/components'
import { landFactory } from './land-factory'

export const commander = new EntityBuilder('Commander')
  .withComponent(new ComponentPosition(0.0, 0.0))
  .withComponent(new ComponentVelocity(0.0, 0.0))
  .withComponent(new ComponentGraphics('commander', { scale: 1.4 }))
  .withComponent(new ComponentDimensions(32, 32))
  .withComponent(new ComponentSelectable())
  .withComponent(new ComponentUI([landFactory]))
