import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function extractYear(dateStr) {
  const bcMatch = dateStr.match(/(\d+)\s*BC/i);
  if (bcMatch) return `${bcMatch[1]} BC`;
  const cMatch = dateStr.match(/c\.\s*(\d+)/i);
  if (cMatch) return `c. ${cMatch[1]}`;
  const yearMatch = dateStr.match(/\d{4}/);
  return yearMatch ? yearMatch[0] : dateStr;
}

function extractCity(placeStr) {
  const city = placeStr.split(",")[0].trim();
  return city.length > 16 ? city.slice(0, 14) + "…" : city;
}

function computeProjectionConfig(birth, death, isSame) {
  const [lon1, lat1] = birth;
  const [lon2, lat2] = death;
  const centerLon = (lon1 + lon2) / 2;
  const centerLat = (lat1 + lat2) / 2;

  if (isSame) {
    return { center: [centerLon, centerLat], scale: 900 };
  }

  const lonSpan = Math.abs(lon1 - lon2);
  const latSpan = Math.abs(lat1 - lat2);

  // Minimum visible extent and a wider padding multiplier (3.0 vs 2.5)
  // keeps both pins comfortably inside the viewport for all span combinations,
  // including cross-country pairs with a large latitude difference.
  const effectiveLonSpan = Math.max(lonSpan, 30);
  const effectiveLatSpan = Math.max(latSpan, 16);

  const scaleForLon = 34600 / (effectiveLonSpan * 3.0);
  const scaleForLat = 12700 / (effectiveLatSpan * 3.0);

  const scale = Math.min(scaleForLon, scaleForLat, 800);
  return { center: [centerLon, centerLat], scale: Math.max(scale, 140) };
}

function PulseMarker({ coords, color, city, year }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Marker coordinates={coords}>
      <g
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "default" }}
      >
        {/* Outer dashed ring */}
        <circle
          r={hovered ? 18 : 14}
          fill="none"
          stroke={color}
          strokeWidth={0.9}
          strokeDasharray="3 2"
          opacity={0.45}
          style={{ transition: "r 0.25s ease" }}
        />
        {/* Art deco diamond */}
        <polygon points="0,-8 6,0 0,8 -6,0" fill={color} stroke="#0d0700" strokeWidth={0.9} opacity={0.95} />
        <polygon points="0,-4.5 3,0 0,4.5 -3,0" fill="#0d0700" opacity={0.55} />

        {/* City label above */}
        <text
          y={-16}
          textAnchor="middle"
          fill={color}
          fontSize={10}
          fontFamily="Cinzel, serif"
          letterSpacing={0.7}
          fontWeight="700"
          paintOrder="stroke"
          stroke="#0d0700"
          strokeWidth={3}
          strokeLinejoin="round"
        >
          {city}
        </text>

        {/* Year label below */}
        <text
          y={22}
          textAnchor="middle"
          fill={color}
          fontSize={9}
          fontFamily="Playfair Display, serif"
          fontStyle="italic"
          opacity={0.9}
          paintOrder="stroke"
          stroke="#0d0700"
          strokeWidth={3}
          strokeLinejoin="round"
        >
          {year}
        </text>
      </g>
    </Marker>
  );
}

export default function WorldMap({ person }) {
  const isSame =
    person.birthCoords[0] === person.deathCoords[0] &&
    person.birthCoords[1] === person.deathCoords[1];

  const birthCoords = isSame
    ? [person.birthCoords[0] - 0.8, person.birthCoords[1]]
    : [...person.birthCoords];
  const deathCoords = isSame
    ? [person.deathCoords[0] + 0.8, person.deathCoords[1]]
    : [...person.deathCoords];

  const projConfig = computeProjectionConfig(birthCoords, deathCoords, isSame);

  return (
    <div className="map-container">
      <ComposableMap
        projection="geoNaturalEarth1"
        height={280}
        style={{ width: "100%", height: "auto", display: "block" }}
        projectionConfig={projConfig}
      >
        <defs>
          <pattern
            id="gridPattern"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="#2a1e08"
              strokeWidth="0.5"
              opacity="0.35"
            />
          </pattern>
        </defs>

        <rect x="-10000" y="-10000" width="20000" height="20000" fill="#0d0800" />
        <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#gridPattern)" />

        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#2a1800"
                stroke="#8B6914"
                strokeWidth={0.4}
                style={{
                  default: { fill: "#2a1800", outline: "none" },
                  hover: { fill: "#2a1800", outline: "none" },
                  pressed: { fill: "#2a1800", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {!isSame && (
          <Line
            from={birthCoords}
            to={deathCoords}
            stroke="#C9A84C"
            strokeWidth={0.8}
            strokeLinecap="round"
            strokeDasharray="5 4"
            opacity={0.4}
          />
        )}

        <PulseMarker
          coords={birthCoords}
          color="#4FC3F7"
          city={extractCity(person.birthPlace)}
          year={extractYear(person.birthDate)}
        />
        <PulseMarker
          coords={deathCoords}
          color="#EF9A9A"
          city={extractCity(person.deathPlace)}
          year={extractYear(person.deathDate)}
        />
      </ComposableMap>

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-diamond" style={{ background: "#4FC3F7" }} />
          <span style={{ color: "#4FC3F7" }}>BIRTH</span>
        </div>
        <div className="legend-item">
          <span className="legend-diamond" style={{ background: "#EF9A9A" }} />
          <span style={{ color: "#EF9A9A" }}>DEATH</span>
        </div>
      </div>
    </div>
  );
}
