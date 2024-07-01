import {produce} from "immer";
import {del, get, post} from "@/commons/interceptors";

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
      const response = await get(`admin/domains?page=${page}&itemPerPage=${itemPerPage}&search=${search}`)

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

      throw err
    }
  },
  createDomain: async (payload) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`admin/domains`, payload)

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

      throw err
    }
  },
  updateDomain: async ({ id, data }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`admin/domains/${id}`, data)

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

      throw err
    }
  },
  deleteDomain: async (id) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await del(`admin/domains/${id}`)

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

      throw err
    }
  }
})


export default createDomainSlice;
