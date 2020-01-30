import { EntityTemplate } from '~/utils'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentIcon,
  ComponentDimensions,
  ComponentMobile,
  ComponentOrders,
  ComponentEngineering,
  ComponentSelectable,
  ComponentProducer,
} from '~/components'

export const engineer = new EntityTemplate('Engineer').withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  new ComponentIcon('engineer'),
  new ComponentDimensions(32, 32),
  new ComponentMobile(0.3),
  new ComponentSelectable(),
  new ComponentOrders(),
  new ComponentEngineering(10),
])
