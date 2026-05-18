import axiosClient from "@/api/axiosClient";
import type { AddAlternativePayload, DrugWithAlternatives } from "@/types/drugAlternative";

export const drugAlternativeService = {
  getByDrugId: async (drugId: number): Promise<DrugWithAlternatives> => {
    const { data } = await axiosClient.get<DrugWithAlternatives>(`/drugalternatives/${drugId}`);
    return data;
  },

  create: async (payload: AddAlternativePayload): Promise<void> => {
    await axiosClient.post<void>("/drugalternatives", payload);
  },

  delete: async (drugId: number, alternativeId: number): Promise<void> => {
    const { data } = await axiosClient.delete<void>(`/drugalternatives/${drugId}/${alternativeId}`);
    return data;
  },
}