import { Core, Component, Entity, Resource, System } from '.'

class TestComponent extends Component {
  static id = 'test-component'
}

class TestResource extends Resource {
  static id = 'test-resource'
}

class TestSystem extends System {
  static id = 'test-system'

  static query = {
    core: true,
    components: [TestComponent],
    resources: [TestResource],
  }

  public dispatch = jest.fn()
}

describe('core', () => {
  const core = new Core()

  const component = new TestComponent()
  const resource = new TestResource()
  const system = new TestSystem()

  it('addComponent', () => {
    core.addComponent(TestComponent)

    expect(core.components.has(TestComponent.id)).toBe(true)
  })

  it('addEntity', () => {
    core.addEntity([component])
  })

  it('addResource', async () => {
    await core.addResource(resource)

    expect(core.resources.has(TestResource.id)).toBe(true)
  })

  it('addSystem', () => {
    core.addSystem(system)

    expect(core.systems.has(TestSystem.id)).toBe(true)
    expect(core.queries.has(TestSystem.id)).toBe(true)
  })

  it('dispatch', () => {
    core.dispatch()

    expect(system.dispatch).toBeCalled()

    const [entities, components, resources]: [
      Set<Entity>,
      Map<Entity, Component>[],
      Resource[],
      // @ts-ignore
    ] = system.dispatch.mock.calls[0]

    expect(entities.size).toBe(1)
    expect(components.length).toBe(1)
    expect(components[0].size).toBe(1)
    expect(components[0].get(Array.from(entities.values())[0])).toBe(component)
    expect(resources.length).toBe(1)
    expect(resources[0]).toBe(resource)
  })
})
