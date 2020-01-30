import { EntityTemplate } from '~/utils'
import {
  ComponentPosition,
  ComponentIcon,
  ComponentDimensions,
  ComponentSelectable,
  ComponentDraft,
  ComponentProducer,
} from '~/components'

export const extractor = new EntityTemplate('Extractor').withComponents([
  new ComponentPosition(0.0, 0.0),
  new ComponentIcon('extractor'),
  new ComponentDimensions(32, 32),
  new ComponentSelectable(),
  new ComponentDraft(60, 36, 360),
  new ComponentProducer(2, -2),
])
