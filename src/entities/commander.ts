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
} from '~/components'
import { extractor, generator, landFactory } from '~/entities'

export const commander = new EntityTemplate('Commander').withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  new ComponentIcon('commander'),
  new ComponentDimensions(32, 32),
  new ComponentMobile(0.3),
  new ComponentSelectable(),
  new ComponentBuildOptions([extractor, generator, landFactory]),
  new ComponentOrders(),
  new ComponentEngineering(10),
  new ComponentProducer(1, 20),
])
