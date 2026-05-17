import axios from "axios";
import { toast } from "sonner";

export const handleApiError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const responseData = err.response?.data;

    const validationErrors = responseData?.errors;

    const serverMessage = responseData?.Message || responseData?.message;

    if (validationErrors) {
      const messages = Object.values(validationErrors).flat();
      messages.forEach((msg) => toast.error(String(msg)));
      return;
    }

    if (serverMessage) {
      toast.error(serverMessage);
    } else if (err.response?.status === 400) {
      toast.error("Invalid data. Please check your inputs.");
    } else if (err.code === "ERR_NETWORK") {
      toast.error("Connection failed. Please check your network.");
    } else {
      toast.error(`Unexpected error (${err.response?.status ?? "Unknown"})`);
    }
  } else {
    console.error("Non-Axios Error:", err);
    toast.error("An unexpected error occurred.");
  }
};
