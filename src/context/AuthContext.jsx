import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

function messageFromError(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshCustomers = useCallback(async () => {
    try {
      const { data } = await api.get("/users/customers");
      setUsers(
        (data.customers || []).map((customer) => ({
          ...customer,
          role: "customer",
        }))
      );
    } catch {
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("delish_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);

        if (data.user?.role === "admin") {
          await refreshCustomers();
        }
      } catch {
        localStorage.removeItem("delish_token");
        setUser(null);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [refreshCustomers]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("delish_token", data.token);
      setUser(data.user);

      if (data.user.role === "admin") {
        await refreshCustomers();
      } else {
        setUsers([]);
      }

      return { ok: true, user: data.user };
    } catch (error) {
      return {
        ok: false,
        message: messageFromError(error, "Login failed."),
      };
    }
  };

  const register = async ({ fullName, email, phone, password }) => {
    try {
      const { data } = await api.post("/auth/register", {
        fullName,
        email,
        phone,
        password,
      });

      localStorage.setItem("delish_token", data.token);
      setUser(data.user);
      setUsers([]);

      return { ok: true, user: data.user };
    } catch (error) {
      return {
        ok: false,
        message: messageFromError(error, "Registration failed."),
      };
    }
  };

  const updateProfile = async ({ fullName, phone, email }) => {
    try {
      const { data } = await api.put("/users/profile", {
        fullName,
        phone,
        ...(email ? { email } : {}),
      });

      setUser(data.user);

      return { ok: true, user: data.user };
    } catch (error) {
      return {
        ok: false,
        message: messageFromError(error, "Profile update failed."),
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("delish_token");
    setUser(null);
    setUsers([]);
  };

  const value = useMemo(
    () => ({
      user,
      users,
      loading,
      login,
      register,
      logout,
      updateProfile,
      refreshCustomers,
    }),
    [user, users, loading, refreshCustomers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
