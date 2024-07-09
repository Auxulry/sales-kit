import {produce} from "immer";
import {del, get, post, setHeaderSession} from "@/commons/interceptors";
import {handlerHttp} from "@/commons/handler";

export const initialState = {
  isLoading: false,
  items: [],
  totalItems: 0,
  error: false,
  errorMessage: ''
}

const createDomainSlice = (set) => ({
  ...initialState,
  getDomains: async ({ page = 0, itemPerPage = 0, search = '' }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      const response = await get(`admin/domains?page=${page+1}&itemPerPage=${itemPerPage}&search=${search}`, {}, setHeaderSession(true))

      const data = response.data;

      set(produce((state) => {
        state.isLoading = false;
        state.error = false;
        state.errorMessage = ''
        state.items = data?.data?.items || []
        state.totalItems = data?.data?.totalItems || 0
      }));
    } catch (err) {
      set(produce((state) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
      }));

      handlerHttp(err?.data?.code, err?.data?.message, true)

      throw err
    }
  },
  createDomain: async (payload) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`admin/domains`, payload, setHeaderSession(true))

      set(produce((state) => {
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

      handlerHttp(err?.data?.code, err?.data?.message, true)

      throw err
    }
  },
  updateDomain: async ({ id, data }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`admin/domains/${id}`, data, setHeaderSession(true))

      set(produce((state) => {
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

      handlerHttp(err?.data?.code, err?.data?.message, true)

      throw err
    }
  },
  deleteDomain: async (id) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await del(`admin/domains/${id}`, {},  setHeaderSession(true))

      set(produce((state) => {
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

      handlerHttp(err?.data?.code, err?.data?.message, true)

      throw err
    }
  }
})


export default createDomainSlice;
