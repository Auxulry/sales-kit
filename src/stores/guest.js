import {produce} from "immer";
import {get, post} from "@/commons/interceptors";

export const initialState = {
  isLoading: false,
  salesInfo: {
    username: '',
    name: '',
    phone: '',
    socialMedia: [],
    ads: []
  },
  error: false,
  errorMessage: '',
  isNotFound: false
}

const createGuestSlice = (set) => ({
  ...initialState,
  getSalesInfo: async (name) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      const response = await get(`sales-info/${name}`);

      const data = response.data;

      set(produce((state) => {
        state.isLoading = false;
        state.error = false;
        state.isNotFound = false;
        state.errorMessage = ''
        state.salesInfo = data?.data;
      }));

    } catch (err) {
      if (err?.data?.code === 404) {
        set(produce((state) => {
          state.isLoading = false;
          state.error = true;
          state.isNotFound = true;
          state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
        }));
      } else {
        set(produce((state) => {
          state.isLoading = false;
          state.error = true;
          state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
        }));
      }
      throw err
    }
  },
  addGuestToCustomer: async (payload) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post('sales-info', payload)

      set(produce((state) => {
        state.isLoading = false;
        state.error = false;
        state.isNotFound = false;
        state.errorMessage = ''
      }));
    } catch (err) {
      if (err?.data?.code === 404) {
        set(produce((state) => {
          state.isLoading = false;
          state.error = true;
          state.isNotFound = true;
          state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
        }));
      } else {
        set(produce((state) => {
          state.isLoading = false;
          state.error = true;
          state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
        }));
      }

      throw err
    }
  }
})

export default createGuestSlice;
