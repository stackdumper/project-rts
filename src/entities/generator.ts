import {
  ComponentPosition,
  ComponentDimensions,
  ComponentSelectable,
  ComponentIcon,
  ComponentProducer,
  ComponentTexture,
  ComponentHealth,
  ComponentCollidable,
  ComponentRigid,
} from '~/components'
import { EntityTemplate } from '~/utils'

export const generator = new EntityTemplate('Generator', {
  mass: 75,
  energy: 750,
  time: 125,
}).withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentIcon('generator'),
  new ComponentTexture('ground'),
  new ComponentHealth(600),
  new ComponentDimensions(32, 32),
  new ComponentSelectable(),
  new ComponentProducer(0, 20),
  new ComponentCollidable(),
  new ComponentRigid(),
])
