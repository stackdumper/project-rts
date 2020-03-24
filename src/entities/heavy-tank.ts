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

export const heavyTank = new EntityTemplate('Heavy Tank', {
  mass: 1,
  energy: 1,
  time: 1,
}).withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  new ComponentIcon('assaultBot'),
  new ComponentTexture('land'),
  new ComponentHealth(3000),
  new ComponentDimensions(42, 42),
  new ComponentMobile(0.6),
  new ComponentSelectable(),
  new ComponentOrders(),
  new ComponentWeaponry(22 * 16, 60 * 2, 600, 4),
  new ComponentTarget(),
  new ComponentCollidable(),
  new ComponentRigid(),
])
