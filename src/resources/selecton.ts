import { Resource, Entity } from '~/core'
import EventEmitter from 'eventemitter3'

export enum ResourceSelectionEvent {
  EntitySelected = 'entity-selected',
  EntityDeselected = 'entity-deselected',
}

export class ResourceSelection extends Resource {
  public events: EventEmitter<ResourceSelectionEvent> = new EventEmitter()

  public selected?: Entity = undefined

  public selectEntity = (entity: Entity) => {
    this.events.emit(ResourceSelectionEvent.EntitySelected, entity)
    this.selected = entity
  }

  public deselectEntity = () => {
    this.events.emit(ResourceSelectionEvent.EntityDeselected, this.selected)
    this.selected = undefined
  }
}
