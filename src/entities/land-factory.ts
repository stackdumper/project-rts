import { EntityTemplate } from '~/utils'
import {
  ComponentPosition,
  ComponentIcon,
  ComponentProductionOptions,
  ComponentDimensions,
  ComponentDraft,
  ComponentOrders,
  ComponentSelectable,
} from '~/components'
import { engineer } from '~/entities'

export const landFactory = new EntityTemplate('Land Factory').withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentIcon('landFactory', 1.3),
  new ComponentProductionOptions([engineer]),
  new ComponentDimensions(152, 152),
  new ComponentSelectable(),
  new ComponentDraft(300, 210, 1500),
  new ComponentOrders(),
])
