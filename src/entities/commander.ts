import { EntityTemplate } from '~/utils'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentIcon,
  ComponentDimensions,
  ComponentSelectable,
  ComponentMobile,
  ComponentBuildOptions,
  ComponentOrders,
  ComponentEngineering,
  ComponentProducer,
  ComponentTexture,
  ComponentHealth,
} from '~/components'
import { extractor, generator, landFactory } from '~/entities'

export const commander = new EntityTemplate('Commander', {
  mass: 0,
  energy: 0,
  time: 0,
}).withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  new ComponentIcon('commander'),
  new ComponentTexture('land'),
  new ComponentDimensions(32, 32),
  new ComponentHealth(12000),
  new ComponentMobile(0.3),
  new ComponentSelectable(),
  new ComponentBuildOptions([extractor, generator, landFactory]),
  new ComponentOrders(),
  // new ComponentEngineering(10),
  new ComponentEngineering(100),
  new ComponentProducer(1, 20),
])
