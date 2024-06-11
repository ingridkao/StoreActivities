import instance from '@/plugins/api/instance'
import ScanEntryApi from '@/api/scanEntryService'
import CheckInServiceApi from '@/api/checkInService'
import PrizeServiceApi from '@/api/prizeService'

export default {
  scanEntry: ScanEntryApi(instance, '/ScanEntry'),
  checkIn: CheckInServiceApi(instance, '/CheckIn'),
  prize: PrizeServiceApi(instance, '/Prize')
}
