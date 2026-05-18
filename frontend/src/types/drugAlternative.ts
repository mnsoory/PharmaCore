export interface DrugAlternative {
  id: number;
  tradeName: string;
  genericName: string;
  concentration?: string | null;
}

export interface DrugWithAlternatives {
  drugId: number;
  tradeName: string;
  genericName: string;
  concentration?: string | null;
  alternatives: DrugAlternative[];
}

export interface AddAlternativePayload {
  drugId: number;
  alternativeDrugId: number;
}