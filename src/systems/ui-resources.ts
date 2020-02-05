import { System } from '~/core'
import { ResourceResources, ResourcePlayers } from '~/resources'

/**
 * SystemUIResources is responsible for showing resources in the top left menu.
 */
export class SystemUIResources extends System {
  static id = 'ui-resources'
  static query = {
    core: false,
    components: [],
    resources: [ResourceResources, ResourcePlayers],
  }

  // woah
  private bars = {
    energyShadow: document.querySelector(
      '#resource-energy .bar-container-shadow',
    )! as HTMLDivElement,
    massShadow: document.querySelector(
      '#resource-mass .bar-container-shadow',
    )! as HTMLDivElement,

    energy: document.querySelector('#resource-energy .bar')! as HTMLDivElement,
    mass: document.querySelector('#resource-mass .bar')! as HTMLDivElement,

    energyMax: document.querySelector(
      '#resource-energy .bar-indicator-max',
    )! as HTMLDivElement,
    massMax: document.querySelector(
      '#resource-mass .bar-indicator-max',
    )! as HTMLDivElement,

    energyCurrent: document.querySelector(
      '#resource-energy .bar-indicator-current',
    )! as HTMLDivElement,
    massCurrent: document.querySelector(
      '#resource-mass .bar-indicator-current',
    )! as HTMLDivElement,

    energyProduction: document.querySelector(
      '#resource-energy .resource-production',
    )! as HTMLDivElement,
    massProduction: document.querySelector(
      '#resource-mass .resource-production',
    )! as HTMLDivElement,

    energyConsumption: document.querySelector(
      '#resource-energy .resource-consumption',
    )! as HTMLDivElement,
    massConsumption: document.querySelector(
      '#resource-mass .resource-consumption',
    )! as HTMLDivElement,
  }

  public dispatch(
    _: never,
    __: [],
    [resources, players]: [ResourceResources, ResourcePlayers],
  ) {
    const { mass, energy } = resources.get(players.currentPlayer)!

    // resource current
    this.bars.energyCurrent.textContent = energy.current.toFixed(0)
    this.bars.massCurrent.textContent = mass.current.toFixed(0)

    // resource max
    this.bars.energyMax.textContent = energy.max.toString()
    this.bars.massMax.textContent = mass.max.toString()

    // resource production
    this.bars.energyProduction.textContent = '+' + energy.production.toString()
    this.bars.massProduction.textContent = '+' + mass.production.toString()

    // resource consumption
    this.bars.energyConsumption.textContent = '-' + energy.consumption.toFixed(0)
    this.bars.massConsumption.textContent = '-' + mass.consumption.toFixed(0)

    // resource fill
    const energyPercentage = (energy.current / energy.max) * 100
    const massPercentage = (mass.current / mass.max) * 100

    // bar position
    this.bars.energy.style.transform = `translateX(${energyPercentage - 100}%)`
    this.bars.mass.style.transform = `translateX(${massPercentage - 100}%)`

    // bar opacity
    this.bars.energy.style.opacity = `${0.8 + (energyPercentage / 100) * 0.2}`
    this.bars.mass.style.opacity = `${0.8 + (massPercentage / 100) * 0.2}`

    // accent resource is full
    if (energyPercentage === 100) {
      this.bars.energyShadow.style.boxShadow = '0 0 5px -0.4px #F79F1F'
    } else {
      this.bars.energyShadow.style.boxShadow = ''
    }
    if (massPercentage === 100) {
      this.bars.massShadow.style.boxShadow = '0 0 5px -0.4px #009432'
    } else {
      this.bars.massShadow.style.boxShadow = ''
    }
  }
}
