const API_URL = "http://localhost:5000/api/auth"; //PLACE HOLDER

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        throw new Error("Login failed");
    }
    const data = await response.json();
    return data; 
};

export const logout = async () => {
  await fetch(`${API_URL}/admin/logout`, {
    method: "POST", 
    credentials: "include",
  });
};

export const verifySession = async () => {
  const response = await fetch(`${API_URL}/admin/verify`, { // Endpoint depends on backend
    method: "GET",
    credentials: "include",
  });
  
  if (!response.ok) return null;
  return response.json();
};