import type { Response } from '@/types'
import { instance } from './instance'

export function getLoginQrcode() {
  return instance.get<Blob>('login/get_login_qr', {
    responseType: 'blob'
  })
}

export function getLoginUrl() {
  return instance.get<Response<any>>('login/get_login_url')
}

export function getUserAgreement(data: { check: 'y' | 'n' }) {
  return instance.post<Response<any>>('login/use_agree', data)
}

export function doReLogin() {
  return instance.post<Response<any>>('login/re_login')
}

export function getUserAgreementState() {
  return instance.post<Response<any>>('login/use_agree_state')
}

export function getLoginStatus() {
  return instance.post<Response<boolean>>('login/get_login_status')
}

export function getLoginUserInfo() {
  return instance.get<Response<any>>('login/get_nav')
}
