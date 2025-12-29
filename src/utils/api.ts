// Utility function for making authenticated API calls
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Check if body is FormData - if so, don't set Content-Type (browser will set it with boundary)
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    // Only set Content-Type if not FormData (browser sets it automatically for FormData)
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Helper function to get user data from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Helper function to clear authentication data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}; 