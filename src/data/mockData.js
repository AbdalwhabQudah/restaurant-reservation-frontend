export const initialMenuItems = [
  {
    id: 1,
    name: "Chicken Pasta",
    category: "Main Dishes",
    price: 7.5,
    description: "Creamy pasta with grilled chicken and herbs.",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Beef Burger",
    category: "Main Dishes",
    price: 6.0,
    description: "Classic beef burger with cheese and fresh vegetables.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Starters",
    price: 4.5,
    description: "Fresh lettuce, parmesan, croutons and dressing.",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Margherita Pizza",
    category: "Main Dishes",
    price: 8.0,
    description: "Tomato sauce, mozzarella and fresh basil.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Chocolate Cake",
    category: "Desserts",
    price: 3.0,
    description: "Rich chocolate cake served with ice cream.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Lemon Juice",
    category: "Drinks",
    price: 2.0,
    description: "Fresh lemon juice with mint.",
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
  },
];

export const initialTables = [
  { id: 1, tableNumber: 1, capacity: 2, location: "Indoor" },
  { id: 2, tableNumber: 2, capacity: 2, location: "Indoor" },
  { id: 3, tableNumber: 3, capacity: 4, location: "Indoor" },
  { id: 4, tableNumber: 4, capacity: 4, location: "Outdoor" },
  { id: 5, tableNumber: 5, capacity: 6, location: "Indoor" },
  { id: 6, tableNumber: 6, capacity: 6, location: "Outdoor" },
  { id: 7, tableNumber: 7, capacity: 8, location: "Indoor" },
];

export const initialReservations = [
  {
    id: 1,
    userId: 2,
    customerName: "Ahmad Ali",
    date: "2026-09-05",
    time: "19:30",
    guests: 4,
    tableId: 3,
    status: "Confirmed",
    specialRequest: "Birthday celebration",
  },
  {
    id: 2,
    userId: 2,
    customerName: "Ahmad Ali",
    date: "2026-08-20",
    time: "20:00",
    guests: 2,
    tableId: 1,
    status: "Completed",
    specialRequest: "",
  },
  {
    id: 3,
    userId: 3,
    customerName: "Sara Ahmad",
    date: "2026-09-05",
    time: "20:00",
    guests: 2,
    tableId: 2,
    status: "Pending",
    specialRequest: "",
  },
];
