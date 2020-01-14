import { System, Core } from '~/core'
import { ResourceResources } from '~/resources'

/**
 * SystemRenderResources is responsible for showing resources in the top left menu.
 */
export class SystemUIResources extends System {
  static id = 'velocity'

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

  public update(core: Core) {
    const resources = core.getResource(ResourceResources) as ResourceResources

    // resource current
    this.bars.energyCurrent.textContent = resources.energy.current.toFixed(0)
    this.bars.massCurrent.textContent = resources.mass.current.toFixed(0)

    // resource max
    this.bars.energyMax.textContent = resources.energy.max.toString()
    this.bars.massMax.textContent = resources.mass.max.toString()

    // resource production
    this.bars.energyProduction.textContent = '+' + resources.energy.production.toString()
    this.bars.massProduction.textContent = '+' + resources.mass.production.toString()

    // resource consumption
    this.bars.energyConsumption.textContent =
      '-' + resources.energy.consumption.toString()
    this.bars.massConsumption.textContent = '-' + resources.mass.consumption.toString()

    // resource fill
    const energyPercentage = (resources.energy.current / resources.energy.max) * 100
    const massPercentage = (resources.mass.current / resources.mass.max) * 100

    // bar position
    this.bars.energy.style.transform = `translateX(${energyPercentage - 100}%)`
    this.bars.mass.style.transform = `translateX(${massPercentage - 100}%)`

    // bar opacity
    this.bars.energy.style.opacity = `${0.8 + (energyPercentage / 100) * 0.2}`
    this.bars.mass.style.opacity = `${0.8 + (massPercentage / 100) * 0.2}`

    // accent resource is full
    if (energyPercentage === 100) {
      this.bars.energyShadow.style.boxShadow = '0 0 5px -0.4px #F79F1F'
    }
    if (massPercentage === 100) {
      this.bars.massShadow.style.boxShadow = '0 0 5px -0.4px #009432'
    }
  }
}
