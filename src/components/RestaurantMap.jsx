import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function RestaurantMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      return;
    }

    // Demo restaurant location in Amman
    const restaurantPosition = [
      31.9539,
      35.9106,
    ];

    const map = L.map(
      mapContainerRef.current
    ).setView(
      restaurantPosition,
      14
    );

    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,

        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);

    const restaurantIcon = L.divIcon({
      className: "",

      html: `
        <div
          style="
            background:#111;
            width:38px;
            height:38px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            display:flex;
            align-items:center;
            justify-content:center;
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,.35);
          "
        >
          <span
            style="
              transform:rotate(45deg);
              color:white;
              font-size:18px;
            "
          >
            🍽
          </span>
        </div>
      `,

      iconSize: [38, 38],

      iconAnchor: [19, 38],

      popupAnchor: [0, -38],
    });

    L.marker(
      restaurantPosition,
      {
        icon: restaurantIcon,
      }
    )
      .addTo(map)
      .bindPopup(`
        <strong>Delish Restaurant</strong>
        <br />
        Amman, Jordan
        <br />
        Fresh Food. Great Moments.
      `)
      .openPopup();

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    />
  );
}