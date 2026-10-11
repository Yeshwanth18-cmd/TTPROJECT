import type { AuthResponse, UserRole } from "../types/auth";
import { INITIAL_USERS } from "./mockData";

export interface CurrentUser {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  company?: string;
}

const USER_KEY = "uplift_user";
const TOKEN_KEY = "uplift_token";

export function getCurrentUser(): CurrentUser | null {
  const user = localStorage.getItem(USER_KEY);
  if (!user) {
    // Default to a demo Client user so the app is immediately exploratory
    const defaultUser: CurrentUser = {
      userId: 101,
      name: "Aakash Mehta",
      email: "aakash@techcraft.in",
      role: "CLIENT",
      company: "TechCraft Labs",
    };
    saveCurrentUser(defaultUser);
    localStorage.setItem(TOKEN_KEY, "mock-jwt-demo-token-client-101");
    return defaultUser;
  }

  try {
    return JSON.parse(user) as CurrentUser;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || "mock-jwt-demo-token";
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function saveSession(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.token || `mock-jwt-${data.userId}-${Date.now()}`);
  saveCurrentUser({
    userId: data.userId,
    name: data.name,
    email: data.email,
    role: data.role,
  });
}

export function saveCurrentUser(user: CurrentUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("uplift_auth_change"));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("uplift_auth_change"));
}

export function loginAsDemo(role: UserRole): CurrentUser {
  const target = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
  const userObj: CurrentUser = {
    userId: target.userId,
    name: target.name,
    email: target.email,
    role: target.role,
    company: role === "CLIENT" ? "TechCraft Labs" : undefined,
    title: role === "FREELANCER" ? "Full-Stack Developer & AI Specialist" : undefined,
  };
  localStorage.setItem(TOKEN_KEY, `mock-demo-token-${role.toLowerCase()}-${target.userId}`);
  saveCurrentUser(userObj);
  return userObj;
}

export function switchDemoRole(targetRole: UserRole): CurrentUser {
  return loginAsDemo(targetRole);
}

export function loginMock(email: string, _password?: string): CurrentUser {
  const existing = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return loginAsDemo(existing.role);
  }
  // Generic user fallback
  const userObj: CurrentUser = {
    userId: Math.floor(Math.random() * 900) + 100,
    name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    role: "FREELANCER",
  };
  localStorage.setItem(TOKEN_KEY, `mock-token-${userObj.userId}`);
  saveCurrentUser(userObj);
  return userObj;
}

export function registerMock(name: string, email: string, _password: string, role: UserRole): CurrentUser {
  const userObj: CurrentUser = {
    userId: Math.floor(Math.random() * 900) + 300,
    name,
    email,
    role,
  };
  localStorage.setItem(TOKEN_KEY, `mock-token-${userObj.userId}`);
  saveCurrentUser(userObj);
  return userObj;
}