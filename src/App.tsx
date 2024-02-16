import "./App.css";
import {
  Circle,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { areas } from "./data";
import "github-fork-ribbon-css/gh-fork-ribbon.css";

const DEFAULT_LOCATION_HELSINKI: [number, number] = [60.16952, 24.93545];
const MAX_TORI_URL_LENGTH_BEFORE_IT_REDIRECTS_TO_MAIN_PAGE = 764;

function App() {
  const [center, setCenter] = useState(DEFAULT_LOCATION_HELSINKI);
  const [radius, setRadius] = useState(5_000);
  const [area, setArea] = useState<"inside" | "overlap">("inside");
  const [searchTerms, setSearchTerms] = useState("");
  const selectedAreas = useMemo(() => {
    return areas.filter((alue) => {
      const touches = (point: [number, number]) =>
        distanceBetweenCoordinates(center, point) < radius;
      return area === "inside"
        ? alue.polygon.every(touches)
        : alue.polygon.some(touches);
    });
  }, [center, radius, area]);

  const destinationUrl = useMemo(() => {
    const postCodes = selectedAreas.map((a) => a.postinumeroalue).join(" OR ");
    const searchQuery = encodeURIComponent(`${searchTerms} ${postCodes}`);
    return `https://www.tori.fi/koko_suomi?q=${searchQuery}&cg=0&w=3`;
  }, [searchTerms, selectedAreas]);

  const error =
    destinationUrl.length > MAX_TORI_URL_LENGTH_BEFORE_IT_REDIRECTS_TO_MAIN_PAGE
      ? "Liian suuri hakualue, valitsethan pienemmän alueen."
      : null;

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      document.location.href = destinationUrl;
    },
    [destinationUrl]
  );

  return (
    <div className="App">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "calc(100vh - 200px)" }}
      >
        <Centerer onCenter={setCenter} onBoundsChange={setRadius} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={center} radius={radius} />
      </MapContainer>
      <form onSubmit={onSubmit}>
        <div>
          <strong>Hae tori.fi:sta ympyrän alueelta</strong>
        </div>
        <div>
          Postinumeroalue:
          <label>
            <input
              type="radio"
              name="area"
              checked={area === "inside"}
              value="inside"
              onChange={(e) => setArea(e.target.value as "inside" | "overlap")}
            />
            Kokonaan ympyrän sisällä
          </label>
          <label>
            <input
              type="radio"
              name="area"
              checked={area === "overlap"}
              value="overlap"
              onChange={(e) => setArea(e.target.value as "inside" | "overlap")}
            />
            Vähänkään ympyrän sisällä
          </label>
        </div>
        <div>
          <label>
            Hakusanat:{" "}
            <input
              type="text"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
            />
          </label>
        </div>
        {error && <div className="error">{error}</div>}
        <div>
          <button type="submit" disabled={error ? true : undefined}>
            Etsi tori.fi:sta!
          </button>
        </div>
        <div className="areas">
          <small>
            Valitut alueet:
            <ul>
              {selectedAreas.map((a) => (
                <li key={a.postinumeroalue}>
                  {a.nimi} ({a.postinumeroalue})
                </li>
              ))}
            </ul>
          </small>
        </div>
      </form>
    </div>
  );
}

function Centerer({
  onCenter,
  onBoundsChange,
}: {
  onCenter?: (center: [number, number]) => void;
  onBoundsChange?: (minRadiusMeters: number) => void;
}) {
  const map = useMap();

  const updateBounds = useCallback(() => {
    const bounds = map.getBounds();
    const minRadiusMeters =
      (Math.min(
        distanceBetweenCoordinates(
          [bounds.getNorth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()]
        ),
        distanceBetweenCoordinates(
          [bounds.getNorth(), bounds.getWest()],
          [bounds.getSouth(), bounds.getWest()]
        )
      ) /
        2) *
      0.8;
    onBoundsChange?.(minRadiusMeters);
  }, [map, onBoundsChange]);

  useMapEvent("move", (e) => {
    const center = map.getCenter();
    onCenter?.([center.lat, center.lng]);
  });

  useMapEvent("zoomend", (e) => {
    updateBounds();
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      map.setView([position.coords.latitude, position.coords.longitude]);
      onCenter?.([position.coords.latitude, position.coords.longitude]);
    });
    updateBounds();
  }, [map, onCenter, updateBounds]);
  return null;
}

export default App;

function distanceBetweenCoordinates(
  c1: [number, number],
  c2: [number, number]
) {
  const [lat1, lon1] = c1;
  const [lat2, lon2] = c2;
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
}
