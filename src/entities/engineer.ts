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
  ComponentBuildOptions,
  ComponentTexture,
  ComponentHealth,
} from '~/components'
import { extractor, generator } from '~/entities'

export const engineer = new EntityTemplate('Engineer', {
  mass: 100,
  energy: 1000,
  time: 30,
}).withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  new ComponentIcon('engineer'),
  new ComponentTexture('land'),
  new ComponentHealth(150),
  new ComponentDimensions(32, 32),
  new ComponentMobile(1),
  new ComponentSelectable(),
  new ComponentOrders(),
  new ComponentEngineering(10),
  new ComponentBuildOptions([extractor, generator]),
])
