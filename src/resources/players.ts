import { Resource } from '~/core'

type Player = {
  nickname: string
  color: number
}

export class ResourcePlayers extends Map<number, Player> implements Resource {
  static id = 'players'

  public initialize() {}
}
