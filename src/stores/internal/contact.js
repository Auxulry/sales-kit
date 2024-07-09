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

const createContactSlice = (set) => ({
  ...initialState,
  getContacts: async ({ page = 0, itemPerPage = 0, search = '', status = '' }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      const response = await get(`admin/contacts?page=${page+1}&itemPerPage=${itemPerPage}&search=${search}&status=${status}`, {}, setHeaderSession(true))

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
  createContact: async (payload) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`admin/contacts`, payload, setHeaderSession(true))

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
  updateContact: async ({ id, data }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`admin/contacts/${id}`, data, setHeaderSession(true))

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
  deleteContact: async (id) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await del(`admin/contacts/${id}`, {}, setHeaderSession(true))

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


export default createContactSlice;
