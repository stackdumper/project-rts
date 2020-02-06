import { EntityTemplate } from '~/utils'
import {
  ComponentPosition,
  ComponentIcon,
  ComponentProductionOptions,
  ComponentDimensions,
  ComponentOrders,
  ComponentSelectable,
  ComponentEngineering,
  ComponentTexture,
  ComponentHealth,
} from '~/components'
import { engineer } from './engineer'

export const landFactory = new EntityTemplate('Land Factory', {
  mass: 210,
  energy: 1500,
  time: 300,
}).withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentIcon('landFactory', 1.3),
  new ComponentTexture('ground'),
  new ComponentHealth(4800),
  new ComponentProductionOptions([engineer]),
  new ComponentDimensions(128, 128),
  new ComponentSelectable(),
  new ComponentOrders(),
  new ComponentEngineering(100),
])
