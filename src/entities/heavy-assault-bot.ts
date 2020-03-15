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

export const heavyAssaultBot = new EntityTemplate('Heavy Assault Bot', {
  mass: 1,
  energy: 1,
  time: 1,
}).withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentVelocity(0.0, 0.0),
  new ComponentIcon('assaultBot'),
  new ComponentTexture('land'),
  new ComponentHealth(1000),
  new ComponentDimensions(32, 32),
  new ComponentMobile(1.2),
  new ComponentSelectable(),
  new ComponentOrders(),
  new ComponentWeaponry(18 * 16, 60 / 10, 30, 6),
  new ComponentTarget(),
  new ComponentCollidable(),
  new ComponentRigid(),
])
