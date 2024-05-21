import instance from "@/plugins/api/instance";
import ScanEntryApi from "@/api/scanEntryService";
import CheckInServiceApi from "@/api/checkInService";

export default {
	scanEntry: ScanEntryApi(instance, "/ScanEntry"),
	checkIn: CheckInServiceApi(instance, "/CheckIn"),
};