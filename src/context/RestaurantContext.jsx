import { createContext, useContext, useMemo, useState } from "react";
import {
  initialMenuItems,
  initialReservations,
  initialTables,
} from "../data/mockData";

const RestaurantContext = createContext(null);

function storedOrDefault(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function RestaurantProvider({ children }) {
  const [menuItems, setMenuItems] = useState(() =>
    storedOrDefault("delish_menu_items", initialMenuItems)
  );
  const [tables, setTables] = useState(() =>
    storedOrDefault("delish_tables", initialTables)
  );
  const [reservations, setReservations] = useState(() =>
    storedOrDefault("delish_reservations", initialReservations)
  );

  const saveMenuItems = (items) => {
    setMenuItems(items);
    localStorage.setItem("delish_menu_items", JSON.stringify(items));
  };

  const saveTables = (items) => {
    setTables(items);
    localStorage.setItem("delish_tables", JSON.stringify(items));
  };

  const saveReservations = (items) => {
    setReservations(items);
    localStorage.setItem("delish_reservations", JSON.stringify(items));
  };

  const findAvailableTable = (date, time, guests) => {
    const busyIds = reservations
      .filter(
        (r) =>
          r.date === date &&
          r.time === time &&
          !["Cancelled", "Rejected"].includes(r.status)
      )
      .map((r) => r.tableId);

    return (
      tables
        .filter((table) => table.capacity >= Number(guests))
        .sort((a, b) => a.capacity - b.capacity)
        .find((table) => !busyIds.includes(table.id)) || null
    );
  };

  const addReservation = (reservation) => {
    const next = [
      ...reservations,
      {
        ...reservation,
        id: Date.now(),
        status: "Pending",
      },
    ];
    saveReservations(next);
  };

  const updateReservation = (id, changes) => {
    saveReservations(
      reservations.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  };

  const deleteReservation = (id) => {
    saveReservations(reservations.filter((item) => item.id !== id));
  };

  const addMenuItem = (item) => {
    saveMenuItems([...menuItems, { ...item, id: Date.now() }]);
  };

  const updateMenuItem = (id, changes) => {
    saveMenuItems(
      menuItems.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  const deleteMenuItem = (id) => {
    saveMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const addTable = (table) => {
    saveTables([...tables, { ...table, id: Date.now() }]);
  };

  const updateTable = (id, changes) => {
    saveTables(
      tables.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  const deleteTable = (id) => {
    saveTables(tables.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      menuItems,
      tables,
      reservations,
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
    [menuItems, tables, reservations]
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
