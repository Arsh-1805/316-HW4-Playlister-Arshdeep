/*
 * Auth HTTP API using Fetch (axios-like return shape)
 */

const API_BASE_URL = "http://localhost:4000/auth";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  return { data, status: res.status };
}

export const getLoggedIn = () =>
  fetchJSON(`${API_BASE_URL}/loggedIn`, { method: "GET" });

export const loginUser = (email, password) =>
  fetchJSON(`${API_BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logoutUser = () =>
  fetchJSON(`${API_BASE_URL}/logout`, { method: "GET" });

export const registerUser = (
  firstName,
  lastName,
  email,
  password,
  passwordVerify
) =>
  fetchJSON(`${API_BASE_URL}/register`, {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      passwordVerify,
    }),
  });

const apis = { getLoggedIn, registerUser, loginUser, logoutUser };
export default apis;
