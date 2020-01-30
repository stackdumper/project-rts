import {
  ComponentPosition,
  ComponentDimensions,
  ComponentSelectable,
  ComponentIcon,
  ComponentDraft,
  ComponentProducer,
} from '~/components'
import { EntityTemplate } from '~/utils'

export const generator = new EntityTemplate('Generator').withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentIcon('generator'),
  new ComponentDimensions(32, 32),
  new ComponentSelectable(),
  new ComponentDraft(125, 75, 750),
  new ComponentProducer(0, 20),
])
