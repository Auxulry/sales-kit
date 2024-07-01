import { produce } from "immer";
import {get, post, setHeaderSession} from "@/commons/interceptors";
import {clearCookie, getClientSideCookie, setCookies} from "@/commons/cookies";

const profile = getClientSideCookie('_sales_kit_admin_profile') !== null
  ? JSON.parse(getClientSideCookie('_sales_kit_admin_profile'))
  : {
    name: '',
    email: '',
    domain: '',
    socialMedia: [],
    isAdmin: false
  };

export const initialState = {
  isLoading: false,
  profile,
  isAuthenticated: getClientSideCookie('_sales_kit_admin_token') !== null,
  error: false,
  errorMessage: ''
};

const createAdminSlice = (set) => ({
  ...initialState,
  postAuthentication: async (payload) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      const response = await post('authentication/login', payload, setHeaderSession(true));

      const data = response.data;

      setCookies([
        { name: '_sales_kit_admin_token', value: data?.data?.accessToken }
      ]);

      set(produce((state) => {
        state.isLoading = false;
        state.error = false;
        state.errorMessage = '';
      }));
      await createAdminSlice(set).fetchMe()
      console.log('end')
    } catch (err) {
      set(produce((state) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
      }));
      throw err
    }
  },
  fetchMe: async () => {
    set(produce((state) => {
      state.isLoading = true;
    }));
    console.log('here')
    try {
      const response = await get('authentication/me', {}, setHeaderSession(true));

      const data = response.data;

      setCookies([
        { name: '_sales_kit_admin_profile', value: JSON.stringify(data?.data) }
      ]);

      set(produce((state) => {
        state.profile = data?.data;
        state.isLoading = false;
        state.error = false;
        state.errorMessage = ''
      }));

    } catch (err) {
      set(produce((state) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
      }));

      return err;
    }
  },
  logout: async () => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post('authentication/logout', {}, setHeaderSession(true));

      set(produce((state) => {
        state.isLoading = false;
        state.error = false;
        state.errorMessage = '';
      }));

      clearCookie(['_sales_kit_admin_token', '_sales_kit_admin_profile'])
    } catch (err) {
      set(produce((state) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
      }));
      throw err
    }
  }
});

export default createAdminSlice;
