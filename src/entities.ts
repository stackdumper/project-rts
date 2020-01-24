import {
  ComponentPosition,
  ComponentVelocity,
  ComponentDimensions,
  ComponentSelectable,
  ComponentGraphics,
  ComponentOwnership,
  ComponentMobile,
  ComponentDestination,
} from '~/components'

export const entities = {
  commander: (id: number) => [
    new ComponentOwnership(id),
    new ComponentPosition(100 + id * 400, 300.0),
    new ComponentVelocity(0.0, 0.0),
    new ComponentGraphics('commander'),
    new ComponentDimensions(32, 32),
    new ComponentMobile(0.3),
    new ComponentSelectable(),
  ],
}
