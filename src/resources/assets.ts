import * as PIXI from 'pixi.js'
import { Resource } from '~/core'
import { assets } from '~/assets'

export class ResourceAssets extends Resource {
  public textures!: Record<keyof typeof assets, PIXI.LoaderResource>

  public initialize() {
    return new Promise((resolve, reject) => {
      const loader = new PIXI.Loader()

      for (const name of Object.keys(assets)) {
        // @ts-ignore
        loader.add(name, assets[name])
      }

      loader
        .on('complete', () => {
          // @ts-ignore
          this.textures = loader.resources

          resolve()
        })
        .on('error', (error) => reject(error))
        .load()
    })
  }
}
