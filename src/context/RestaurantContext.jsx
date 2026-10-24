import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const RestaurantContext = createContext(null);

function errorMessage(error, fallback = "Request failed.") {
  return error?.response?.data?.message || fallback;
}

function mapMenuItem(item) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image: item.imageUrl || item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    imageUrl: item.imageUrl || item.image_url || null,
    isAvailable: item.isAvailable ?? item.is_available ?? true,
    categoryId: item.categoryId ?? item.category_id,
    category: item.category,
  };
}

function mapTable(item) {
  return {
    id: item.id,
    tableNumber: item.tableNumber ?? item.table_number,
    capacity: Number(item.capacity),
    location: item.location,
    isActive: item.isActive ?? item.is_active ?? true,
  };
}

function mapReservation(item, currentUser) {
  return {
    id: item.id,
    userId: item.user_id ?? item.userId ?? currentUser?.id,
    customerName:
      item.customer_name ?? item.customerName ?? currentUser?.fullName ?? "Customer",
    customerEmail: item.customer_email ?? item.customerEmail,
    tableId: item.table_id ?? item.tableId,
    tableNumber: item.table_number ?? item.tableNumber,
    date: item.reservation_date ?? item.date,
    time: String(item.reservation_time ?? item.time ?? "").slice(0, 5),
    guests: Number(item.guest_count ?? item.guests ?? 0),
    status: item.status,
    specialRequest: item.special_request ?? item.specialRequest ?? "",
    capacity: item.capacity,
    location: item.location,
  };
}

export function RestaurantProvider({ children }) {
  const { user } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMenu = useCallback(async () => {
    const { data } = await api.get("/menu");
    setMenuItems((data.menuItems || []).map(mapMenuItem));
  }, []);

  const loadCategories = useCallback(async () => {
    const { data } = await api.get("/menu/categories");
    setCategories(data.categories || []);
  }, []);

  const loadTables = useCallback(async () => {
    const { data } = await api.get("/tables");
    setTables((data.tables || []).map(mapTable));
  }, []);

  const loadReservations = useCallback(async () => {
    if (!user) {
      setReservations([]);
      return;
    }

    const endpoint = user.role === "admin" ? "/reservations" : "/reservations/my";
    const { data } = await api.get(endpoint);

    setReservations(
      (data.reservations || []).map((item) => mapReservation(item, user))
    );
  }, [user]);

  useEffect(() => {
    async function loadPublicData() {
      try {
        setLoading(true);
        setError("");
        await Promise.all([loadMenu(), loadCategories(), loadTables()]);
      } catch (requestError) {
        setError(errorMessage(requestError, "Could not load restaurant data."));
      } finally {
        setLoading(false);
      }
    }

    loadPublicData();
  }, [loadMenu, loadCategories, loadTables]);

  useEffect(() => {
    loadReservations().catch((requestError) => {
      setError(errorMessage(requestError, "Could not load reservations."));
    });
  }, [loadReservations]);

  const findAvailableTable = async (date, time, guests) => {
    const { data } = await api.get("/reservations/availability", {
      params: {
        date,
        time,
        guests,
      },
    });

    return data.available ? mapTable(data.table) : null;
  };

  const addReservation = async (reservation) => {
    const { data } = await api.post("/reservations", {
      reservationDate: reservation.date,
      reservationTime: reservation.time,
      guestCount: Number(reservation.guests),
      specialRequest: reservation.specialRequest || "",
    });

    await loadReservations();
    return data;
  };

  const updateReservation = async (id, changes) => {
    let response;

    if (changes.status) {
      if (user?.role === "customer" && changes.status === "Cancelled") {
        response = await api.patch(`/reservations/${id}/cancel`);
      } else {
        response = await api.patch(`/reservations/${id}/status`, {
          status: changes.status,
        });
      }
    } else {
      response = await api.put(`/reservations/${id}`, {
        ...(changes.date ? { reservationDate: changes.date } : {}),
        ...(changes.time ? { reservationTime: changes.time } : {}),
        ...(changes.guests !== undefined
          ? { guestCount: Number(changes.guests) }
          : {}),
        ...(changes.specialRequest !== undefined
          ? { specialRequest: changes.specialRequest }
          : {}),
      });
    }

    await loadReservations();
    return response.data;
  };

  const deleteReservation = async (id) => {
    const { data } = await api.patch(`/reservations/${id}/cancel`);
    await loadReservations();
    return data;
  };

  const categoryIdFor = (item) => {
    if (item.categoryId) return Number(item.categoryId);

    const category = categories.find((candidate) => candidate.name === item.category);

    if (!category) {
      throw new Error(`Unknown menu category: ${item.category}`);
    }

    return category.id;
  };

  const addMenuItem = async (item) => {
    const { data } = await api.post("/menu", {
      categoryId: categoryIdFor(item),
      name: item.name,
      description: item.description,
      price: Number(item.price),
      imageUrl: item.imageUrl ?? item.image ?? null,
      isAvailable: item.isAvailable ?? true,
    });

    await loadMenu();
    return data;
  };

  const updateMenuItem = async (id, item) => {
    const { data } = await api.put(`/menu/${id}`, {
      categoryId: categoryIdFor(item),
      name: item.name,
      description: item.description,
      price: Number(item.price),
      imageUrl: item.imageUrl ?? item.image ?? null,
      isAvailable: item.isAvailable ?? true,
    });

    await loadMenu();
    return data;
  };

  const deleteMenuItem = async (id) => {
    const { data } = await api.delete(`/menu/${id}`);
    await loadMenu();
    return data;
  };

  const addTable = async (table) => {
    const { data } = await api.post("/tables", {
      tableNumber: Number(table.tableNumber),
      capacity: Number(table.capacity),
      location: table.location,
      isActive: table.isActive ?? true,
    });

    await loadTables();
    return data;
  };

  const updateTable = async (id, table) => {
    const { data } = await api.put(`/tables/${id}`, {
      ...(table.tableNumber !== undefined
        ? { tableNumber: Number(table.tableNumber) }
        : {}),
      ...(table.capacity !== undefined
        ? { capacity: Number(table.capacity) }
        : {}),
      ...(table.location !== undefined ? { location: table.location } : {}),
      ...(table.isActive !== undefined ? { isActive: table.isActive } : {}),
    });

    await loadTables();
    return data;
  };

  const deleteTable = async (id) => {
    const { data } = await api.delete(`/tables/${id}`);
    await loadTables();
    return data;
  };

  const value = useMemo(
    () => ({
      menuItems,
      categories,
      tables,
      reservations,
      loading,
      error,
      refreshMenu: loadMenu,
      refreshTables: loadTables,
      refreshReservations: loadReservations,
      findAvailableTable,
      addReservation,
      updateReservation,
      deleteReservation,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addTable,
      updateTable,
      deleteTable,
    }),
    [
      menuItems,
      categories,
      tables,
      reservations,
      loading,
      error,
      loadMenu,
      loadTables,
      loadReservations,
    ]
  );

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);

  if (!context) {
    throw new Error("useRestaurant must be used inside RestaurantProvider.");
  }

  return context;
}
