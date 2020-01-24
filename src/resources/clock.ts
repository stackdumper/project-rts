import { Resource } from '~/core'

export class ResourceClock extends Resource {
  static id = 'clock'

  public dt: number = 1.0
}
