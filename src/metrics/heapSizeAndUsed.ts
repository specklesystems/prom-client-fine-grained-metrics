import { Gauge, Histogram } from 'prom-client'
import { safeMemoryUsage } from '@/metrics/helpers/safeMemoryUsage'
import { Config } from '@/domain/types'

const NODEJS_HEAP_SIZE_TOTAL = 'nodejs_heap_size_total_bytes'
const NODEJS_HEAP_SIZE_USED = 'nodejs_heap_size_used_bytes'
const NODEJS_EXTERNAL_MEMORY = 'nodejs_external_memory_bytes'
const NODEJS_HEAP_SIZE_TOTAL_HISTOGRAM = 'nodejs_heap_size_total_bytes_histogram'

export const heapSizeAndUsed = (config: Config) => {
  if (typeof process.memoryUsage !== 'function') {
    return
  }
  const labels = config.labels ?? {}
  const labelNames = Object.keys(labels)

  const registers = config.register ? [config.register] : undefined
  const namePrefix = config.namePrefix ?? ''

  const collect = () => {
    const memUsage = safeMemoryUsage()
    if (memUsage) {
      heapSizeTotal.set(labels, memUsage.heapTotal)
      heapSizeUsed.set(labels, memUsage.heapUsed)
      if (memUsage.external !== undefined) {
        externalMemUsed.set(labels, memUsage.external)
      }
    }
  }

  const h = new Histogram({
    name: namePrefix + NODEJS_HEAP_SIZE_TOTAL_HISTOGRAM,
    help: 'Process heap size from Node.js in bytes.',
    registers,
    labelNames,
    collect
  })

  const heapSizeTotal = new Gauge({
    name: namePrefix + NODEJS_HEAP_SIZE_TOTAL,
    help: 'Process heap size from Node.js in bytes.',
    registers,
    labelNames,
    // Use this one metric's `collect` to set all metrics' values.
    collect
  })
  const heapSizeUsed = new Gauge({
    name: namePrefix + NODEJS_HEAP_SIZE_USED,
    help: 'Process heap size used from Node.js in bytes.',
    registers,
    labelNames
  })
  const externalMemUsed = new Gauge({
    name: namePrefix + NODEJS_EXTERNAL_MEMORY,
    help: 'Node.js external memory size in bytes.',
    registers,
    labelNames
  })
}

export const metricNames = [
  NODEJS_HEAP_SIZE_TOTAL,
  NODEJS_HEAP_SIZE_USED,
  NODEJS_EXTERNAL_MEMORY
]
