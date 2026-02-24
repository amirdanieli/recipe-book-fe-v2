import { apiClient } from "./apiClient";

export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("image", file);

  return apiClient<{ url: string }>("/images/upload", {
    method: "POST",
    body: formData,
  });
};
