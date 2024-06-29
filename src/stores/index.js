import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {lens, withLenses} from "@dhmk/zustand-lens";
import createAuthSlice from "@/stores/auth";
import createGuestSlice from "@/stores/guest";
import createSalesSlice from "@/stores/sales";

const useStore = create(
  devtools(
    immer(
      withLenses({
        auth: lens(createAuthSlice),
        guest: lens(createGuestSlice),
        sales: lens(createSalesSlice),
      })
    )
  )
)

export default useStore;
