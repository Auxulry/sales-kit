import {produce} from "immer";
import {get, post, setHeaderSession} from "@/commons/interceptors";
import {handlerHttp} from "@/commons/handler";

export const initialState = {
  isLoading: false,
  items: [],
  error: false,
  errorMessage: ''
}

const createSalesSlice = (set) => ({
  ...initialState,
  getCustomers: async ({ search = '', status = 0 }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      const response = await get(`sales/customers?page=-1&itemPerPage=&search=${search}&status=${status}`, {}, setHeaderSession(false))

      const data = response.data;

      set(produce((state) => {
        state.isLoading = false;
        state.error = false;
        state.errorMessage = ''
        state.items = data?.data?.items
      }));
    } catch (err) {
      set(produce((state) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
      }));

      handlerHttp(err?.data?.code, err?.data?.message, false)

      throw err
    }
  },
  changeStatusCustomer: async ({ id, data }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`sales/customers/${id}`, data, setHeaderSession(false))

      set(produce((state) => {
        state.isLoading = false;
        state.error = false;
        state.errorMessage = ''
      }));

      await createSalesSlice(set).getCustomers({ search: '', status: 0 })

    } catch (err) {
      set(produce((state) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
      }));

      handlerHttp(err?.data?.code, err?.data?.message, false)

      throw err
    }
  },
  addCustomer: async (payload) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`sales/customers`, payload, setHeaderSession(false))

      set(produce((state) => {
        state.isLoading = false;
        state.error = false;
        state.errorMessage = ''
      }));

      await createSalesSlice(set).getCustomers({ search: '', status: 0 })

    } catch (err) {
      set(produce((state) => {
        state.isLoading = false;
        state.error = true;
        state.errorMessage = err?.data?.message || 'An error occurred while fetching data';
      }));

      handlerHttp(err?.data?.code, err?.data?.message, false)

      throw err
    }
  }

})


export default createSalesSlice;
