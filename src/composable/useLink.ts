import { useRouter } from 'vue-router'
import { useBrowserStorage } from '@/composable/useBrowserStorage'
import { useSweetAlert } from '@/composable/useSweetAlert'
import type { AlbumType } from '@/composable/configurable'

export function useLink() {
	const router = useRouter()
	const { deleteSessionStorage, getAcQuery } = useBrowserStorage()
	const { errorAlert } = useSweetAlert()

	const getQueryParam = (url: string, param: string) => {
		const newParam = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
		const regex = new RegExp('[\\?&]' + newParam + '=([^&#]*)')
		const results = regex.exec(url)
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
	}

	const linkToLobby = () => {
		deleteSessionStorage('ac')
		router.push({ name: 'Lobby' })
	}
	const linkToAlbum = () => {
		deleteSessionStorage('ac')
		router.push({ name: 'Album' })
	}

	const BackCollect = () => {
		const acString = getAcQuery()
		if (acString) {
			router.push({
				name: 'Collected',
				params: {
					id: acString
				}
			})
		} else {
			router.push({ name: 'Album' })
		}
	}

	const linkToCollect = (albumItem: AlbumType | null = null) => {
		if (albumItem && albumItem.event_id) {
			router.push({
				name: 'Collected',
				params: {
					id: albumItem.event_id
				}
			})
		} else {
			errorAlert()
		}
	}
	return {
		getQueryParam,
		linkToLobby,
		linkToAlbum,
		BackCollect,
		linkToCollect
	}
}