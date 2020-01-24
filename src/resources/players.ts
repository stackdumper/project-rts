import { Resource } from '~/core'

type Player = {
  nickname: string
  color: number
}

export class ResourcePlayers extends Resource {
  static id = 'players'

  constructor(public players: Map<number, Player>) {
    super()
  }
}
