import {
  ComponentPosition,
  ComponentVelocity,
  ComponentDimensions,
  ComponentSelectable,
  ComponentIcon,
  ComponentMobile,
  ComponentDraft,
  ComponentBuildOptions,
  ComponentOrders,
  ComponentEngineering,
  ComponentProducer,
} from '~/components'
import { EntityTemplate } from '~/utils'

const landFactory = new EntityTemplate('Land Factory').withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  // new ComponentIcon(''),
  new ComponentDimensions(96, 96),
  new ComponentSelectable(),
  new ComponentDraft(300, 210, 1500),
  new ComponentOrders(),
])

const commander = new EntityTemplate('Commander').withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  // new ComponentIcon('commander'),
  new ComponentDimensions(32, 32),
  new ComponentMobile(0.3),
  new ComponentSelectable(),
  new ComponentBuildOptions([landFactory]),
  new ComponentOrders(),
  new ComponentEngineering(10),
  new ComponentProducer(1, 20),
])

export const entities = {
  commander,
  landFactory,
}
