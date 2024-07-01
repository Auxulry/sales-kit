import {produce} from "immer";
import {get, post} from "@/commons/interceptors";

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
      const response = await get(`sales/customers?page=-1&itemPerPage=&search=${search}&status=${status}`)

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

      throw err
    }
  },
  changeStatusCustomer: async ({ id, data }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      await post(`sales/customers/${id}`, data)

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

      throw err
    }
  }
})


export default createSalesSlice;
