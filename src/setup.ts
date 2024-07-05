import { isObject } from '@/utils'
import { heapSizeAndUsed } from '@/metrics/heapSizeAndUsed'
import { Config } from '@/domain/types'

const metrics = [heapSizeAndUsed]

export default function (config: Config) {
  console.log('registering metrics!')

  //register metrics
  if (config !== null && config !== undefined && !isObject(config)) {
    throw new TypeError('config must be null, undefined, or an object')
  }

  for (const metric of Object.values(metrics)) {
    metric(config)
  }

  return () => {
    repeatAction({
      action: collectMetrics,
      period: config.collectionPeriodMilliseconds ?? 100
    })
  }
}

const shouldStopRepeatingAction = false
const repeatAction = (params: { action: () => Promise<void>; period: number }) => {
  return async () => {
    if (shouldStopRepeatingAction) return
    setInterval(repeatAction(params), params.period)
    await params.action()
  }
}

const collectMetrics = () => {
  console.log('collecting metrics')
  return Promise.resolve()
}
