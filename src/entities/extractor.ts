import { EntityTemplate } from '~/utils'
import {
  ComponentPosition,
  ComponentIcon,
  ComponentDimensions,
  ComponentSelectable,
  ComponentProducer,
  ComponentTexture,
  ComponentHealth,
  ComponentCollidable,
  ComponentRigid,
} from '~/components'

export const extractor = new EntityTemplate('Extractor', {
  mass: 36,
  energy: 360,
  time: 60,
}).withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentIcon('extractor'),
  new ComponentTexture('ground'),
  new ComponentHealth(800),
  new ComponentDimensions(32, 32),
  new ComponentSelectable(),
  new ComponentProducer(2, -2),
  new ComponentCollidable(),
  new ComponentRigid(),
])
