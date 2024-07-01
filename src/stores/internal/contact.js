import {produce} from "immer";
import {del, get, post} from "@/commons/interceptors";

export const initialState = {
  isLoading: false,
  items: [],
  totalItems: 0,
  error: false,
  errorMessage: ''
}

const createContactSlice = (set) => ({
  ...initialState,
  getContacts: async ({ page = 0, itemPerPage = 0, search = '' }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      const response = await get(`admin/contacts?page=${page}&itemPerPage=${itemPerPage}&search=${search}`)

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
  createContact: async (payload) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`admin/contacts`, payload)

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
  updateContact: async ({ id, data }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`admin/contacts/${id}`, data)

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
  deleteContat: async (id) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await del(`admin/contacts/${id}`)

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


export default createContactSlice;
