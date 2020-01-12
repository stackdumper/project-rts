import * as PIXI from 'pixi.js'
import { Resource } from '~/core'
import { assets } from '~/assets'

export class ResourceAssets extends Resource {
  constructor(public resources: PIXI.IResourceDictionary) {
    super()
  }

  static loadResources(): Promise<PIXI.IResourceDictionary> {
    return new Promise((resolve, reject) => {
      const loader = new PIXI.Loader()

      for (const name of Object.keys(assets)) {
        // @ts-ignore
        loader.add(name, assets[name])
      }

      loader
        .on('complete', () => resolve(loader.resources))
        .on('error', (error) => reject(error))
        .load()
    })
  }
}
