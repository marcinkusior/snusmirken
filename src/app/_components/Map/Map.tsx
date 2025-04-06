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
import "./Map.css";
import cx from "classnames";

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
  onVisiblePostsChange?: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedPost, setSelectedPost] = React.useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = React.useState<number>(14);
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
    // if (!mapRef.current || !onVisiblePostsChange) return;

    const bounds = mapRef.current.getBounds();
    const visiblePosts = posts
      .filter((post: PostFormValues) => {
        const lngLat = new maplibregl.LngLat(post.longitude, post.latitude);
        return bounds.contains(lngLat);
      })
      .map((post) => post.id);

    onVisiblePostsChange(visiblePosts);
  }, [posts, onVisiblePostsChange]);

  const onZoomChange = () => {
    console.log("zoomie");
    setCurrentZoom(mapRef.current?.getZoom());
    updateVisiblePosts();
  };

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude,
          latitude,
          zoom: 14,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
        onMoveEnd={onZoomChange}
        onZoom={onZoomChange}
        className="relative"
      >
        <AutoFitBounds posts={posts} />
        <FlyToLocation setFlyToCoordinates={setFlyToCoordinates} />

        {posts.map((post, index) => (
          <Popup
            key={post.id}
            latitude={post.latitude}
            longitude={post.longitude}
            closeOnClick={false}
            anchor="bottom"
          >
            <div onClick={() => setSelectedPost(post.imageUrl)}>
              <img
                className={cx("map-image", {
                  "map-image__expand": currentZoom > 15,
                })}
                src={post.imageUrl}
                alt=""
              />
            </div>
          </Popup>
        ))}

        {selectedPost && (
          <div
            onClick={() => {
              setSelectedPost(null);
            }}
            className="absolute left-0 top-0 z-50 flex h-[calc(100%)] w-[100%] items-center justify-center overflow-hidden bg-black/20 p-5"
          >
            <img
              className="imagge relative max-h-[100%] rounded-[16px]"
              src={selectedPost}
              alt=""
            />
          </div>
        )}
      </Map>
    </div>
  );
};
