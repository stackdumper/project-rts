import { EntityBuilder } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentDimensions,
  ComponentSelectable,
  ComponentUI,
} from '~/components'
import { engineer } from './engineer'

export const landFactory = new EntityBuilder('Land factory')
  .withComponent(new ComponentPosition(0.0, 0.0))
  .withComponent(new ComponentVelocity(0.0, 0.0))
  .withComponent(new ComponentGraphics('land_factory'))
  .withComponent(new ComponentDimensions(128, 128))
  .withComponent(new ComponentSelectable())
  .withComponent(new ComponentUI([engineer]))
