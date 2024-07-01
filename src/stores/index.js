import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {lens, withLenses} from "@dhmk/zustand-lens";
import createAuthSlice from "@/stores/auth";
import createGuestSlice from "@/stores/guest";
import createSalesSlice from "@/stores/sales";
import createTeamSlice from "@/stores/internal/team";
import createContactSlice from "@/stores/internal/contact";
import createDomainSlice from "@/stores/internal/domain";

const useStore = create(
  devtools(
    immer(
      withLenses({
        auth: lens(createAuthSlice),
        guest: lens(createGuestSlice),
        sales: lens(createSalesSlice),
        team: lens(createTeamSlice),
        contact: lens(createContactSlice),
        domain: lens(createDomainSlice)
      })
    )
  )
)

export default useStore;
