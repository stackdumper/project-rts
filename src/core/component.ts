export class Component {
  public clone(): Component {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }
}
