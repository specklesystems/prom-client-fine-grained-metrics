import { Registry } from 'prom-client'
export type Config = {
  register?: Registry
  namePrefix?: string
  collectionPeriodMilliseconds?: number
  labels?: string[]
}
