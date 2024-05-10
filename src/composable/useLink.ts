import { useRouter } from 'vue-router'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useSweetAlert } from '@/composable/useSweetAlert'
import type { AlbumType, ScanResultType } from '@/composable/configurable'

export function useLink() {
	const router = useRouter()
	const { getAcStorage } = useBrowserStorage()
	const { errorAlert } = useSweetAlert()

	const getQueryParam = (url: string, param: string) => {
		// eslint-disable-next-line no-useless-escape
		const newParam = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
		const regex = new RegExp('[\\?&]' + newParam + '=([^&#]*)')
		const results = regex.exec(url)
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
	}

	const linkToAlbum = () => {
		router.push({ name: 'Album' })
	}

	const linkToActivity = (activityId: string = '') => {
		if (!activityId) activityId = getAcStorage()
		if (activityId !== '') {
			router.push({
				name: 'Activity',
				params: {
					id: String(activityId)
				}
			})
		} else {
			errorAlert()
		}
	}

	const linkToCollect = (albumItem: ScanResultType | AlbumType | null = null) => {
		const acString = getAcStorage()
		const activityId = albumItem?.event_id || acString
		if (activityId !== '') {
			router.push({
				name: 'Collected',
				params: {
					id: String(activityId)
				}
			})
		} else {
			errorAlert()
		}
	}

	const linkToWinning = () => {
		router.push({ name: 'Winning' })
	}

	const linkToDirection = () => {
		router.push({ name: 'Direction' })
	}

	return {
		getQueryParam,
		linkToAlbum,
		linkToActivity,
		linkToCollect,
		linkToWinning,
		linkToDirection
	}
}
