import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const defaultUsers = [
  {
    id: 1,
    fullName: "System Admin",
    email: "admin@delish.com",
    phone: "0790000000",
    password: "Admin123!",
    role: "admin",
  },
  {
    id: 2,
    fullName: "Ahmad Ali",
    email: "customer@delish.com",
    phone: "0791111111",
    password: "Customer123!",
    role: "customer",
  },
  {
    id: 3,
    fullName: "Sara Ahmad",
    email: "sara@delish.com",
    phone: "0792222222",
    password: "Customer123!",
    role: "customer",
  },
];

function getStoredUsers() {
  try {
    const stored = localStorage.getItem("delish_users");
    return stored ? JSON.parse(stored) : defaultUsers;
  } catch {
    return defaultUsers;
  }
}

function getStoredUser() {
  try {
    const stored = localStorage.getItem("delish_current_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(getStoredUsers);
  const [user, setUser] = useState(getStoredUser);

  const saveUsers = (nextUsers) => {
    setUsers(nextUsers);
    localStorage.setItem("delish_users", JSON.stringify(nextUsers));
  };

  const login = (email, password) => {
    const found = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!found) {
      return { ok: false, message: "Invalid email or password." };
    }

    const safeUser = { ...found };
    delete safeUser.password;

    setUser(safeUser);
    localStorage.setItem("delish_current_user", JSON.stringify(safeUser));

    return { ok: true, user: safeUser };
  };

  const register = ({ fullName, email, phone, password }) => {
    const exists = users.some(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (exists) {
      return { ok: false, message: "An account with this email already exists." };
    }

    const newUser = {
      id: Date.now(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      role: "customer",
    };

    saveUsers([...users, newUser]);

    const safeUser = { ...newUser };
    delete safeUser.password;
    setUser(safeUser);
    localStorage.setItem("delish_current_user", JSON.stringify(safeUser));

    return { ok: true, user: safeUser };
  };

  const updateProfile = ({ fullName, phone }) => {
    if (!user) return;

    const nextUsers = users.map((item) =>
      item.id === user.id
        ? { ...item, fullName: fullName.trim(), phone: phone.trim() }
        : item
    );

    saveUsers(nextUsers);

    const updatedUser = {
      ...user,
      fullName: fullName.trim(),
      phone: phone.trim(),
    };

    setUser(updatedUser);
    localStorage.setItem("delish_current_user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("delish_current_user");
  };

  const value = useMemo(
    () => ({
      user,
      users,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, users]
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
