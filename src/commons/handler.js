import {clearCookie, getClientSideCookie} from "@/commons/cookies";

export function handlerHttp(code, message, isAdmin = false) {
  if (code === 401 && message === 'Unauthenticated.') {
    if (isAdmin) {
      clearCookie(['_sales_kit_admin_token', '_sales_kit_admin_profile'])

      const token = getClientSideCookie('_sales_kit_admin_token') !== null;

      if (!token) {
        window.location.href = '/internal/auth/login'
      }
    } else {
      clearCookie(['_sales_kit_token', '_sales_kit_profile'])

      const token = getClientSideCookie('_sales_kit_token') !== null;

      if (!token) {
        window.location.href = '/auth/login'
      }
    }
  }
}
