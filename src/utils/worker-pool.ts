export class WorkerPool {
  constructor(private workers: (Worker & { available: boolean })[]) {
    workers.forEach((worker) => {
      worker.available = true

      worker.addEventListener('message', () => {
        worker.available = true
      })
    })
  }

  get available() {
    return this.workers.find((t) => t.available)
  }

  public addEventListener(type: 'error' | 'message', func: (event: MessageEvent) => any) {
    // @ts-ignore
    this.workers.forEach((w) => w.addEventListener(type, func))
  }

  public postMessage(message: any, options: Transferable[]) {
    const worker = this.workers.find((t) => t.available)

    if (worker) {
      worker.available = false
      worker.postMessage(message, options)
    }
  }
}
