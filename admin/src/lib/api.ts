export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_URL = `${BASE_URL}/api`;

// Authentication APIs
export const LOGIN_URL = `${API_URL}/admin/login`;
export const ME = `${API_URL}/admin/me`;
export const LOGOUT_URL = `${API_URL}/admin/logout`;
export const CHANGE_PASSWORD_URL = `${API_URL}/admin/change-password`;


