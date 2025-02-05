import { Client } from '@/types/client'
import moment from 'moment'
import { Ref } from 'vue'
import useDurationStr from '@/hooks/useDurationStr'

type GetSessionInfoItem = (msg: string) => string | number | boolean

export default (
  client: Ref<Partial<Client>>,
): {
  getSessionInfoItem: GetSessionInfoItem
} => {
  const { transSecondNumToSimpleStr } = useDurationStr()

  const getSessionInfoItem: GetSessionInfoItem = (key) => {
    const msg = client.value
    switch (key) {
      case 'subscriptions':
        return msg.subscriptions_cnt + '/' + msg.subscriptions_max
      case 'mqueue':
        return msg.mqueue_len + '/' + msg.mqueue_max
      case 'inflight':
        return msg.inflight_cnt + '/' + msg.inflight_max
      case 'awaiting_rel':
        return msg.awaiting_rel_cnt + '/' + msg.awaiting_rel_max
      case 'created_at':
        return moment(msg[key]).format('YYYY-MM-DD HH:mm:ss')
      case 'heap_size':
        return `${msg.heap_size} bytes`
      case 'expiry_interval':
        return transSecondNumToSimpleStr(msg.expiry_interval as number)
      default:
        return msg[key as keyof Client] ?? ''
    }
  }

  return {
    getSessionInfoItem,
  }
}
