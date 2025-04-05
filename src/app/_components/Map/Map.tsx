import * as React from "react";
import Map, {
  Marker,
  Popup,
  Source,
  Layer,
  useMap,
  MapRef,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PostFormValues } from "~/app/_types/PostFormValues";
import { useRef, useCallback } from "react";
import { map } from "zod";
import FileMenu from "~/components/FileMenu/FileMenu";
import { useMapWindowStore } from "~/app/stores/mapWindowStore";
import { MapAndGallery } from "./MapAndGallery";

export type FlyToCoordinatesFunction = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => void;

const markerSvg = (
  <svg
    height="30px"
    width="30px"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-map-pin"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const AutoFitBounds = ({ posts }: { posts: PostFormValues[] }) => {
  const { current: map } = useMap();

  const onClick = () => {
    if (map) {
      map.flyTo({ center: [-122.4, 37.8], zoom: 10 });
    }
  };

  React.useEffect(() => {
    if (map && posts.length > 0) {
      const bounds = new maplibregl.LngLatBounds();

      posts.forEach((post) => {
        bounds.extend([post.longitude, post.latitude]);
      });

      map.fitBounds(bounds, {
        padding: 20,
        duration: 0,
      });
    }
  }, [posts, map]);

  return <button onClick={onClick}>FLYYY</button>;
};

export const FlyToLocation = ({
  setFlyToCoordinates,
}: {
  setFlyToCoordinates: (flyToCoordinate: FlyToCoordinatesFunction) => void;
}) => {
  const { current: map } = useMap();

  React.useEffect(() => {
    if (map) {
      setFlyToCoordinates(({ latitude, longitude }) => {
        map.flyTo({ center: [longitude, latitude], zoom: 14 });
      });
    }
  }, [map, setFlyToCoordinates]);

  return null;
};

export const MapComponent = ({
  latitude,
  longitude,
  posts,
  setFlyToCoordinates,
  onVisiblePostsChange,
}: {
  latitude: number;
  longitude: number;
  posts: PostFormValues[];
  setFlyToCoordinates: (flyToCoordinate: FlyToCoordinatesFunction) => void;
  onVisiblePostsChange?: (visiblePosts: PostFormValues[]) => void;
}) => {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedPost, setSelectedPost] = React.useState<number | null>(null);
  const lineCoordinates = posts.map((post) => [post.longitude, post.latitude]);

  const geojson = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "LineString" as const,
          coordinates: lineCoordinates,
        },
      },
    ],
  };

  const updateVisiblePosts = useCallback(() => {
    if (!mapRef.current || !onVisiblePostsChange) return;

    const bounds = mapRef.current.getBounds();
    const visiblePosts = posts.filter((post: PostFormValues) => {
      const lngLat = new maplibregl.LngLat(post.longitude, post.latitude);
      return bounds.contains(lngLat);
    });

    onVisiblePostsChange(visiblePosts);
  }, [posts, onVisiblePostsChange]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude,
        latitude,
        zoom: 14,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
      onMoveEnd={updateVisiblePosts}
      onZoomEnd={updateVisiblePosts}
    >
      <AutoFitBounds posts={posts} />
      <FlyToLocation setFlyToCoordinates={setFlyToCoordinates} />

      <Source id="line-source" type="geojson" data={geojson}>
        <Layer
          id="line-layer"
          type="line"
          source="line-source"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "salmon",
            "line-width": 4,
          }}
        />
      </Source>

      {posts.map((post, index) => (
        <Marker
          key={index}
          longitude={post.longitude}
          latitude={post.latitude}
          onClick={() => setSelectedPost(index)}
        >
          {markerSvg}

          {selectedPost === index && (
            <Popup
              latitude={post.latitude}
              longitude={post.longitude}
              onClose={() => setSelectedPost(null)}
              closeOnClick={false}
            >
              <div>
                <h3>{post.name}</h3>
                <p>Latitude: {post.latitude}</p>
                <p>Longitude: {post.longitude}</p>
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </Map>
  );
};
