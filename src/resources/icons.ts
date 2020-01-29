import * as PIXI from 'pixi.js'
import { Resource } from '~/core'

export class ResourceIcons extends Map<keyof typeof ResourceIcons.graphics, PIXI.Texture>
  implements Resource {
  static id = 'icons'

  static graphics = {
    commander: require('~/assets/commander.png'),
    engineer: require('~/assets/engineer.png'),
    landFactory: require('~/assets/land-factory.png'),
  }

  public initialize() {
    return new Promise((resolve, reject) => {
      for (const [key, value] of Object.entries(ResourceIcons.graphics)) {
        PIXI.Loader.shared.add(key, value)
      }

      PIXI.Loader.shared
        .load((_, resources) => {
          Object.keys(resources).forEach((key) => {
            // @ts-ignore
            this.set(key, resources[key]!.texture)
          })

          resolve()
        })
        .on('error', reject)
    })
  }
}
