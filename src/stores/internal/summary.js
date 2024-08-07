import {produce} from "immer";
import {del, get, post, setHeaderSession} from "@/commons/interceptors";
import {handlerHttp} from "@/commons/handler";

export const initialState = {
  isLoading: false,
  items: [],
  summary: {
    totalTeam: 0,
    totalDomain: 0,
    totalAds: 0,
    totalCustomer: 0,
    totalApproach: 0,
    totalNegotiation: 0,
    totalWon: 0,
    totalLost: 0
  },
  totalItems: 0,
  error: false,
  errorMessage: ''
}

const createSummarySlice = (set) => ({
  ...initialState,
  getTeams: async ({ page = 0, itemPerPage = 0, search = '' }) => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      const response = await get(`admin/top-closing?page=${page+1}&itemPerPage=${itemPerPage}&search=${search}`, {}, setHeaderSession(true))

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
  getSummary: async () => {
    set(produce((state) => {
      state.isLoading = true;
    }));

    try {
      const response = await get(`admin/summary`, {}, setHeaderSession(true))

      const data = response.data;

      set(produce((state) => {
        state.isLoading = false;
        state.error = false;
        state.errorMessage = ''
        state.summary = data?.data
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
})


export default createSummarySlice;
