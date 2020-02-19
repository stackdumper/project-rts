import intersection from 'lodash.intersection'
import { ID, Entity } from '.'

export abstract class Component {
  static id: ID

  constructor(...args: any[]) {}

  public clone(): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }
}

/** ComponentStorage is used to store components with Entity as key */
export class ComponentStorage<C extends Component = any> extends Map<Entity, C> {
  public iteration = 0

  constructor(public id: string) {
    super()
  }

  // overwrite base methods to keep iteration number
  public set = (k: Entity, v: C) => {
    this.iteration += 1

    return super.set(k, v)
  }

  public delete = (k: Entity) => {
    this.iteration += 1

    return super.delete(k)
  }

  public clear = () => {
    this.iteration += 1

    return super.clear()
  }

  // key for caching
  public getKey = () => this.id + this.iteration + this.size

  static cache: Map<string, Map<string, Component> & { iteration: string }> = new Map()

  private static intersect: ComponentStorage.Join = (...storages: ComponentStorage[]) => {
    const joint = new Map()

    for (const key of intersection(...storages.map((s) => Array.from(s.keys())))) {
      const components = storages.map((storage) => storage.get(key))

      joint.set(key, components)
    }

    return joint as any
  }

  public static intersectCached: ComponentStorage.Join = (
    ...storages: ComponentStorage[]
  ) => {
    const key = storages.map((s) => s.id).join()
    const iteration = storages.map((s) => s.getKey()).join()

    let cache = ComponentStorage.cache.get(key)
    if (cache && cache.iteration === iteration) {
      return cache
    } else {
      //  @ts-ignore perform intersection
      const joint = ComponentStorage.intersect(...storages)

      joint.iteration = iteration
      ComponentStorage.cache.set(key, joint)

      return joint
    }
  }

  public static join: ComponentStorage.Join = (...storages: ComponentStorage[]) => {
    // @ts-ignore
    return ComponentStorage.intersectCached(...storages)
    // return ComponentStorage.intersect(...storages)
  }
}

namespace ComponentStorage {
  // @ts-ignore
  interface S<X> extends ComponentStorage<X> {}

  export interface Join {
    <A, B>(a: S<A>, b: S<B>): S<[A, B]>
    <A, B, C>(a: S<A>, b: S<B>, c: S<C>): S<[A, B, C]>
    <A, B, C, D>(a: S<A>, b: S<B>, c: S<C>, d: S<D>): S<[A, B, C, D]>
    <A, B, C, D, E>(a: S<A>, b: S<B>, c: S<C>, d: S<D>, e: S<E>): S<[A, B, C, D, E]>
  }
}
