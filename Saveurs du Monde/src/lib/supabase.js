/**
 * Lightweight Supabase REST client for React Native.
 * Uses fetch directly instead of the SDK to avoid Node.js polyfill issues.
 * Supports authenticated requests using the user's access token.
 */

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const getHeaders = (accessToken) => ({
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
});

export const supabase = {
  /**
   * Sign up a new user.
   * @param {string} email
   * @param {string} password
   */
  async signUp(email, password) {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data.msg || data.error_description || 'Signup failed' } };
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  /**
   * Sign in an existing user.
   * @param {string} email
   * @param {string} password
   */
  async signIn(email, password) {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data.error_description || data.msg || 'Login failed' } };
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  /**
   * Insert a row into a table.
   * @param {string} table - Table name
   * @param {object} row - Data to insert
   * @param {string} [accessToken] - User's access token for authenticated requests
   * @returns {Promise<{data: object|null, error: object|null}>}
   */
  async insert(table, row, accessToken) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: getHeaders(accessToken),
        body: JSON.stringify(row),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        return { data: null, error: { message: errorBody.message || `HTTP ${res.status}` } };
      }

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  /**
   * Select rows from a table.
   * @param {string} table - Table name
   * @param {string} [query=''] - PostgREST query string, e.g. 'meal_id=eq.12345'
   * @param {string} [accessToken] - User's access token for authenticated requests
   * @returns {Promise<{data: array|null, error: object|null}>}
   */
  async select(table, query = '', accessToken) {
    try {
      const url = query
        ? `${SUPABASE_URL}/rest/v1/${table}?${query}`
        : `${SUPABASE_URL}/rest/v1/${table}?select=*`;

      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(accessToken),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        return { data: null, error: { message: errorBody.message || `HTTP ${res.status}` } };
      }

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },

  /**
   * Delete rows from a table.
   * @param {string} table - Table name
   * @param {string} query - PostgREST query string, e.g. 'meal_id=eq.12345'
   * @param {string} [accessToken] - User's access token for authenticated requests
   * @returns {Promise<{data: object|null, error: object|null}>}
   */
  async delete(table, query, accessToken) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
        method: 'DELETE',
        headers: getHeaders(accessToken),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        return { data: null, error: { message: errorBody.message || `HTTP ${res.status}` } };
      }

      return { data: true, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  },
};
