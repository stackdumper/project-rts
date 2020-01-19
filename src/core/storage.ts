export class ConstructorMap<V extends { constructor: Function }> extends Map<
  Function,
  V
> {
  public get<T extends V>(constructor: new (...args: any) => T): T {
    return super.get(constructor) as T
  }

  public add(t: V) {
    return super.set(t.constructor, t)
  }

  // @ts-ignore
  public delete(t: V) {
    return super.delete(t.constructor)
  }

  public clone(): ConstructorMap<V> {
    const newMap = new ConstructorMap<V>()

    for (const component of this.values()) {
      newMap.add(
        Object.assign(Object.create(Object.getPrototypeOf(component)), component),
      )
    }

    return newMap
  }
}
