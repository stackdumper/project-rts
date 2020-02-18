import { Resource, Entity } from '~/core'
import { EntityTemplate } from '~/utils'

export class ResourcePlacement extends Resource {
  static id = 'placement'

  public template?: EntityTemplate
  public builder?: Entity
  public placeholder?: Entity
}
