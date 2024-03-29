import { EntityTemplate } from '~/utils'
import {
  ComponentPosition,
  ComponentVelocity,
  ComponentIcon,
  ComponentDimensions,
  ComponentMobile,
  ComponentOrders,
  ComponentSelectable,
  ComponentTexture,
  ComponentHealth,
  ComponentWeaponry,
  ComponentCollidable,
  ComponentRigid,
  ComponentTarget,
} from '~/components'

export const assaultBot = new EntityTemplate('Assault Bot', {
  mass: 0.1,
  energy: 0.1,
  time: 1,
}).withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  new ComponentIcon('assaultBot'),
  new ComponentTexture('land'),
  new ComponentHealth(75),
  new ComponentDimensions(16, 16),
  new ComponentMobile(1.5),
  new ComponentSelectable(),
  new ComponentOrders(),
  new ComponentWeaponry(14 * 16, 60 / 3, 7, 5),
  new ComponentTarget(),
  new ComponentCollidable(),
  new ComponentRigid(),
])
