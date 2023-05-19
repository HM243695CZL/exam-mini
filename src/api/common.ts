import { request } from '@/utils/request';

export const getAction = (url: string, data: any, status: boolean = true) => {
	return request({
		url,
		method: 'GET',
		data
	}, status)
}

export const postAction = (url: string, data: any, status: boolean = true) => {
	return request({
		url,
		method: 'POST',
		data
	}, status)
}