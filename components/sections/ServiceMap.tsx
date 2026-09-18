"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoJSONSource, LngLatBoundsLike, Map as MapLibreMap, Marker } from "maplibre-gl";

export type MapPin = { name: string; lat: number; lon: number };
type LatLon = [number, number];

/** Free vector tiles, no API key (openfreemap.org). Recolored to the brand below. */
const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

/** Brand palette applied over the base style: navy land, deep-blue water, quiet roads. */
const PAINT: [layer: string, prop: string, value: string][] = [
  ["background", "background-color", "#0b1630"],
  ["water", "fill-color", "#123061"],
  ["waterway", "line-color", "#123061"],
  ["landuse_residential", "fill-color", "#0e1b38"],
  ["landcover_wood", "fill-color", "#0f213d"],
  ["landuse_park", "fill-color", "#0f223f"],
  ["building", "fill-color", "#0d1a35"],
  ["highway_path", "line-color", "#16264a"],
  ["highway_minor", "line-color", "#1a2c52"],
  ["highway_major_casing", "line-color", "#1f3560"],
  ["highway_major_inner", "line-color", "#1c2f58"],
  ["highway_major_subtle", "line-color", "#1c2f58"],
  ["highway_motorway_casing", "line-color", "#2a4677"],
  ["highway_motorway_inner", "line-color", "#233d6b"],
  ["highway_motorway_subtle", "line-color", "#233d6b"],
  ["railway", "line-color", "#152648"],
  ["railway_transit", "line-color", "#152648"],
  ["railway_minor", "line-color", "#152648"],
];

/** Closed Catmull-Rom curve through the outline points, so the boundary reads as a soft, hand-drawn area. */
function smoothRing(points: LatLon[], steps = 10): [number, number][] {
  const n = points.length;
  const at = (i: number) => points[(i + n) % n];
  const ring: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      // GeoJSON is [lon, lat]
      ring.push([f(p0[1], p1[1], p2[1], p3[1]), f(p0[0], p1[0], p2[0], p3[0])]);
    }
  }
  ring.push(ring[0]);
  return ring;
}

const PIN_SVG = `<svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 29c-.4 0-.8-.2-1-.5C8.6 25.4 2 17.6 2 11.5 2 5.7 6.5 1 12 1s10 4.7 10 10.5c0 6.1-6.6 13.9-9 17-.2.3-.6.5-1 .5Z" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="11.5" r="3.6" fill="#fff"/></svg>`;

/**
 * Real street map of the service area (MapLibre + OpenFreeMap), loaded only when
 * the section nears the viewport. The coverage outline draws itself in, pins drop
 * onto each neighborhood, and picking one flies the camera there.
 */
export function ServiceMap({
  pins,
  outline,
  active,
  focus,
  inView,
  onPick,
}: {
  pins: MapPin[];
  outline: LatLon[];
  /** Highlighted pin (tour or visitor). */
  active: number | null;
  /** Pin the camera should fly to (visitor picks only); null = whole area. */
  focus: number | null;
  inView: boolean;
  onPick: (i: number, fly: boolean) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const onPickRef = useRef(onPick);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const introDone = useRef(false);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  const ring = useMemo(() => smoothRing(outline), [outline]);
  const bounds = useMemo<LngLatBoundsLike>(() => {
    const lons = ring.map((p) => p[0]);
    const lats = ring.map((p) => p[1]);
    return [
      [Math.min(...lons), Math.min(...lats)],
      [Math.max(...lons), Math.max(...lats)],
    ];
  }, [ring]);

  // Load the map library only when the section is close to the screen.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    let map: MapLibreMap | null = null;

    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        try {
          const maplibregl = (await import("maplibre-gl")).default;
          if (cancelled) return;
          const padding = el.clientWidth < 500 ? 28 : 48;
          map = new maplibregl.Map({
            container: el,
            style: STYLE_URL,
            bounds: bounds,
            fitBoundsOptions: { padding },
            attributionControl: { compact: true },
            cooperativeGestures: true,
            dragRotate: false,
            pitchWithRotate: false,
            touchPitch: false,
            fadeDuration: 0,
          });
          mapRef.current = map;
          map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
          map.touchZoomRotate.disableRotation();

          map.on("load", () => {
            if (!map || cancelled) return;
            for (const [id, prop, value] of PAINT) {
              if (map.getLayer(id)) map.setPaintProperty(id, prop as never, value);
            }
            for (const layer of map.getStyle().layers) {
              if (layer.id.startsWith("boundary")) map.setLayoutProperty(layer.id, "visibility", "none");
              if (layer.type !== "symbol") continue;
              const place = layer.id.startsWith("place_");
              map.setPaintProperty(layer.id, "text-color", place ? "#9fb0cc" : "#4d5d80");
              map.setPaintProperty(layer.id, "text-halo-color", "#081226");
              map.setPaintProperty(layer.id, "text-halo-width", 1.2);
            }

            const firstSymbol = map.getStyle().layers.find((l) => l.type === "symbol")?.id;
            map.addSource("area", {
              type: "geojson",
              data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } },
            });
            // The boundary as a line, so it can be "drawn" along its length (line-progress needs a LineString).
            map.addSource("area-edge", {
              type: "geojson",
              data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: ring.slice(0, 2) } },
            });
            map.addLayer(
              { id: "area-fill", type: "fill", source: "area", paint: { "fill-color": "#3fd8f2", "fill-opacity": 0 } },
              firstSymbol,
            );
            map.addLayer(
              {
                id: "area-glow",
                type: "line",
                source: "area",
                paint: { "line-color": "#3fd8f2", "line-width": 10, "line-blur": 8, "line-opacity": 0 },
              },
              firstSymbol,
            );
            map.addLayer({
              id: "area-line",
              type: "line",
              source: "area-edge",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: { "line-width": 2.5, "line-color": "#3fd8f2", "line-opacity": 0 },
            });

            // Pins: DOM markers so they stay crisp, focusable, and animatable.
            markers.current = pins.map((p, i) => {
              const root = document.createElement("div");
              root.className = "sm-marker";
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "sm-pin";
              btn.style.setProperty("--i", String(i));
              btn.setAttribute("aria-label", `${p.name}: in our service area`);
              btn.innerHTML = `<span class="sm-pin-pulse" aria-hidden="true"></span>${PIN_SVG}<span class="sm-pin-label">${p.name}</span>`;
              btn.addEventListener("click", (ev) => {
                ev.stopPropagation();
                onPickRef.current(i, true);
              });
              btn.addEventListener("mouseenter", () => onPickRef.current(i, false));
              root.appendChild(btn);
              return new maplibregl.Marker({ element: root, anchor: "bottom" }).setLngLat([p.lon, p.lat]).addTo(map!);
            });

            // Small screens: keep the credits behind the (i) button so they don't cover the map.
            if (el.clientWidth < 500) {
              el.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
            }

            setReady(true);
          });
          map.on("error", (ev) => {
            // Tile hiccups are fine; only give up if the style itself never loads.
            if (!map?.isStyleLoaded() && String(ev.error?.message ?? "").includes("style")) setFailed(true);
          });
        } catch {
          setFailed(true);
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      markers.current.forEach((m) => m.remove());
      map?.remove();
      mapRef.current = null;
    };
  }, [pins, ring, bounds]);

  // Intro: glide in, draw the boundary, fill the area.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !inView || introDone.current) return;
    introDone.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.current?.classList.add("is-in");

    const edge = map.getSource("area-edge") as GeoJSONSource | undefined;
    const showEdge = (count: number) =>
      edge?.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: ring.slice(0, Math.max(2, count)) },
      });
    const finish = () => {
      showEdge(ring.length);
      map.setPaintProperty("area-line", "line-opacity", 1);
      map.setPaintProperty("area-fill", "fill-opacity", 0.1);
      map.setPaintProperty("area-glow", "line-opacity", 0.35);
    };
    if (reduce) return finish();

    const cam = map.cameraForBounds(bounds, { padding: box.current!.clientWidth < 500 ? 28 : 48 });
    if (cam) {
      map.jumpTo({ ...cam, zoom: (cam.zoom ?? 9) - 0.9, bearing: -14 });
      map.easeTo({ ...cam, bearing: 0, duration: 2600, easing: (t) => 1 - Math.pow(1 - t, 4) });
    }

    map.setPaintProperty("area-fill", "fill-opacity-transition", { duration: 1400, delay: 1400 });
    map.setPaintProperty("area-glow", "line-opacity-transition", { duration: 1400, delay: 1600 });
    const start = performance.now() + 500;
    let raf = 0;
    map.setPaintProperty("area-line", "line-opacity", 1);
    const draw = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / 2200));
      if (p >= 1) return finish();
      showEdge(Math.round((1 - Math.pow(1 - p, 3)) * ring.length));
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    map.setPaintProperty("area-fill", "fill-opacity", 0.1);
    map.setPaintProperty("area-glow", "line-opacity", 0.35);
    return () => cancelAnimationFrame(raf);
  }, [ready, inView, bounds, ring]);

  // Highlight the active pin.
  useEffect(() => {
    markers.current.forEach((m, i) => {
      const el = m.getElement();
      el.classList.toggle("is-active", i === active);
      el.style.zIndex = i === active ? "2" : "1";
    });
  }, [active, ready]);

  // Fly to a picked neighborhood, or back out to the whole area.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !introDone.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (focus === null) {
      map.fitBounds(bounds, { padding: box.current!.clientWidth < 500 ? 28 : 48, duration: reduce ? 0 : 1400 });
    } else {
      const p = pins[focus];
      const target = { center: [p.lon, p.lat] as [number, number], zoom: 11.4 };
      if (reduce) map.jumpTo(target);
      else map.flyTo({ ...target, speed: 0.9, curve: 1.3 });
    }
  }, [focus, ready, pins, bounds]);

  return (
    <div className="absolute inset-0">
      <div ref={box} className="service-map-canvas h-full w-full" />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className={`text-[0.8125rem] font-semibold ${failed ? "text-mist" : "animate-pulse text-mist/60"}`}>
            {failed ? "Serving Pittsburgh and nearby" : "Loading map…"}
          </span>
        </div>
      )}
    </div>
  );
}
