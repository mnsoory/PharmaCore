import axiosClient from '@/api/axiosClient';
import { type DashboardData } from "@/types/dashboard";

export const getDashboardSummary = async (): Promise<DashboardData> => {
    const response = await axiosClient.get<DashboardData>('/dashboard/summary');
    return response.data;
};