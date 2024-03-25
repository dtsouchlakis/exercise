import L, { Map as LeafletMap, Circle } from "leaflet";
import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Emission } from "../models/Emission";

function EmissionMap({ emission }: { emission: Emission[] }): JSX.Element {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  let mapInstance: LeafletMap | null = null;

  useEffect(() => {
    mapInstance = L.map(mapContainerRef.current!, {
      attributionControl: false,
    }).setView([36.5, 127.5], 7);
    //With leaflet we can relatively easily change tileLayer providers (see: https://leafletjs.com/reference-1.6.0.html#tilelayer)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);
    L.control.attribution({ prefix: false }).addTo(mapInstance);

    emission.forEach((item) => {
      const circle = L.circle([item.latitude!, item.longitude!], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: item.emission * 100,
      }).addTo(mapInstance!);

      circle.bindPopup(
        `<h1>${item.region}</h1><p>Emission: ${item.emission}</p>`
      );
    });

    // Cleanup function
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [emission]);

  return (
    <div ref={mapContainerRef} className="w-full h-full rounded-t-md"></div>
  );
}

export default EmissionMap;
