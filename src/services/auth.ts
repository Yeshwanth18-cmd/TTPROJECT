import type { AuthResponse, UserRole } from "../types/auth";

export interface CurrentUser {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

export function getCurrentUser(): CurrentUser | null {
  const user = localStorage.getItem("uplift_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as CurrentUser;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem("uplift_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function saveSession(data: AuthResponse) {
  localStorage.setItem("uplift_token", data.token);

  localStorage.setItem(
    "uplift_user",
    JSON.stringify({
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    })
  );
}

export function logout() {
  localStorage.removeItem("uplift_token");
  localStorage.removeItem("uplift_user");
}