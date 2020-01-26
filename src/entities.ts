import {
  ComponentPosition,
  ComponentVelocity,
  ComponentDimensions,
  ComponentSelectable,
  ComponentGraphics,
  ComponentMobile,
  ComponentDraft,
  ComponentBuildOptions,
  ComponentOrders,
} from '~/components'
import { EntityTemplate } from '~/utils'

const landFactory = new EntityTemplate('Land Factory').withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  new ComponentGraphics('landFactory'),
  new ComponentDimensions(96, 96),
  new ComponentSelectable(),
  new ComponentDraft(1000, 3500),
  new ComponentOrders(),
])

const commander = new EntityTemplate('Commander').withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  new ComponentGraphics('commander'),
  new ComponentDimensions(32, 32),
  new ComponentMobile(0.3),
  new ComponentSelectable(),
  new ComponentBuildOptions([landFactory]),
  new ComponentOrders(),
])

export const entities = {
  commander,
  landFactory,
}
