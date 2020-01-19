import { EntityBuilder } from '~/core'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentGraphics,
  ComponentDimensions,
  ComponentSelectable,
  ComponentUI,
} from '~/components'

export const engineer = new EntityBuilder('Engineer')
  .withComponent(new ComponentPosition(0.0, 0.0))
  .withComponent(new ComponentVelocity(0.0, 0.0))
  .withComponent(new ComponentGraphics('engineer'))
  .withComponent(new ComponentDimensions(20, 20))
  .withComponent(new ComponentSelectable())
  .withComponent(new ComponentUI([]))
