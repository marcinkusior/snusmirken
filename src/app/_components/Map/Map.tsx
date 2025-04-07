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
import { useRef, useCallback, useMemo } from "react";
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

interface Cluster {
  latitude: number;
  longitude: number;
  posts: PostFormValues[];
  count: number;
}

const CLUSTER_RADIUS = 50; // pixels
const MIN_CLUSTER_SIZE = 2;

const calculateClusterCenter = (
  posts: PostFormValues[],
): { latitude: number; longitude: number } => {
  const sum = posts.reduce(
    (acc, post) => ({
      latitude: acc.latitude + post.latitude,
      longitude: acc.longitude + post.longitude,
    }),
    { latitude: 0, longitude: 0 },
  );
  return {
    latitude: sum.latitude / posts.length,
    longitude: sum.longitude / posts.length,
  };
};

const createClusters = (
  posts: PostFormValues[],
  zoom: number,
  mapRef: React.RefObject<MapRef>,
): Cluster[] => {
  if (!mapRef.current || posts.length === 0) return [];

  const clusters: Cluster[] = [];
  const processed = new Set<number>();

  posts.forEach((post, i) => {
    if (processed.has(i)) return;

    const nearbyPosts: PostFormValues[] = [post];
    processed.add(i);

    // Find nearby posts
    posts.forEach((otherPost, j) => {
      if (i === j || processed.has(j)) return;

      const point1 = mapRef.current!.project([post.longitude, post.latitude]);
      const point2 = mapRef.current!.project([
        otherPost.longitude,
        otherPost.latitude,
      ]);

      const distance = Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2),
      );

      if (distance < CLUSTER_RADIUS) {
        nearbyPosts.push(otherPost);
        processed.add(j);
      }
    });

    if (nearbyPosts.length >= MIN_CLUSTER_SIZE) {
      const center = calculateClusterCenter(nearbyPosts);
      clusters.push({
        ...center,
        posts: nearbyPosts,
        count: nearbyPosts.length,
      });
    } else {
      // Single post
      clusters.push({
        latitude: post.latitude,
        longitude: post.longitude,
        posts: [post],
        count: 1,
      });
    }
  });

  return clusters;
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
  const [expandedCluster, setExpandedCluster] = React.useState<Cluster | null>(
    null,
  );

  // Function to get current map bounds
  const getMapBounds = useCallback(() => {
    if (!mapRef.current) return null;

    // Method 1: Get bounds directly from the map
    const bounds = mapRef.current.getBounds();

    // Method 2: Get bounds with padding (useful for clustering)
    const paddedBounds = mapRef.current.getBounds().toArray().flat();
    const padding = 0.1; // 10% padding
    const [minLng, minLat, maxLng, maxLat] = paddedBounds;
    const lngPadding = (maxLng - minLng) * padding;
    const latPadding = (maxLat - minLat) * padding;

    return {
      bounds,
      paddedBounds: [
        minLng - lngPadding,
        minLat - latPadding,
        maxLng + lngPadding,
        maxLat + latPadding,
      ],
      // Method 3: Get center and zoom
      center: mapRef.current.getCenter(),
      zoom: mapRef.current.getZoom(),
    };
  }, []);

  const clusters = useMemo(() => {
    return createClusters(posts, currentZoom, mapRef);
  }, [posts, currentZoom]);

  const updateVisiblePosts = useCallback(() => {
    if (!mapRef.current || !onVisiblePostsChange) return;

    const mapBounds = getMapBounds();
    if (!mapBounds) return;

    const visiblePosts = posts
      .filter((post) => {
        const lngLat = new maplibregl.LngLat(post.longitude, post.latitude);
        return mapBounds.bounds.contains(lngLat);
      })
      .map((post) => post.id);

    onVisiblePostsChange(visiblePosts);
  }, [posts, onVisiblePostsChange, getMapBounds]);

  const onZoomChange = () => {
    if (mapRef.current) {
      setCurrentZoom(mapRef.current.getZoom() ?? 14);
      updateVisiblePosts();
    }
  };

  // Example of using bounds for clustering
  const createClusters = useCallback(
    (
      posts: PostFormValues[],
      zoom: number,
      mapRef: React.RefObject<MapRef>,
    ): Cluster[] => {
      if (!mapRef.current || posts.length === 0) return [];

      const mapBounds = getMapBounds();
      if (!mapBounds) return [];

      const clusters: Cluster[] = [];
      const processed = new Set<number>();

      // Only process posts within the padded bounds
      const [minLng, minLat, maxLng, maxLat] = mapBounds.paddedBounds;

      posts.forEach((post, i) => {
        if (processed.has(i)) return;

        // Skip posts outside the padded bounds
        if (
          post.longitude < minLng ||
          post.longitude > maxLng ||
          post.latitude < minLat ||
          post.latitude > maxLat
        ) {
          return;
        }

        const nearbyPosts: PostFormValues[] = [post];
        processed.add(i);

        // Find nearby posts
        posts.forEach((otherPost, j) => {
          if (i === j || processed.has(j)) return;

          const point1 = mapRef.current!.project([
            post.longitude,
            post.latitude,
          ]);
          const point2 = mapRef.current!.project([
            otherPost.longitude,
            otherPost.latitude,
          ]);

          const distance = Math.sqrt(
            Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2),
          );

          if (distance < CLUSTER_RADIUS) {
            nearbyPosts.push(otherPost);
            processed.add(j);
          }
        });

        if (nearbyPosts.length >= MIN_CLUSTER_SIZE) {
          const center = calculateClusterCenter(nearbyPosts);
          clusters.push({
            ...center,
            posts: nearbyPosts,
            count: nearbyPosts.length,
          });
        } else {
          // Single post
          clusters.push({
            latitude: post.latitude,
            longitude: post.longitude,
            posts: [post],
            count: 1,
          });
        }
      });

      return clusters;
    },
    [getMapBounds],
  );

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
      >
        <AutoFitBounds posts={posts} />
        <FlyToLocation setFlyToCoordinates={setFlyToCoordinates} />

        {clusters.map((cluster, index) => (
          <Popup
            key={`${cluster.latitude}-${cluster.longitude}-${index}`}
            latitude={cluster.latitude}
            longitude={cluster.longitude}
            closeOnClick={false}
            anchor="bottom"
          >
            {cluster.count > 1 ? (
              <div
                className="cursor-pointer rounded-full bg-blue-500 px-4 py-2 text-white"
                onClick={() => setExpandedCluster(cluster)}
              >
                {cluster.count} posts
              </div>
            ) : (
              <div
                onClick={() =>
                  cluster.posts[0]?.imageUrl &&
                  setSelectedPost(cluster.posts[0].imageUrl)
                }
              >
                <img
                  className={cx("map-image", {
                    "map-image__expand": currentZoom > 15,
                  })}
                  src={cluster.posts[0]?.imageUrl}
                  alt=""
                />
              </div>
            )}
          </Popup>
        ))}

        {expandedCluster && (
          <div
            className="absolute left-0 top-0 z-50 flex h-[calc(100%)] w-[100%] items-center justify-center overflow-hidden bg-black/20 p-5"
            onClick={() => setExpandedCluster(null)}
          >
            <div className="grid max-h-[80vh] max-w-[80vw] grid-cols-3 gap-4 overflow-auto rounded-lg bg-white p-4">
              {expandedCluster.posts.map((post, index) => (
                <div key={index} className="relative">
                  <img
                    className="h-48 w-48 rounded-lg object-cover"
                    src={post.imageUrl}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedPost && (
          <div
            onClick={() => setSelectedPost(null)}
            className="absolute left-0 top-0 z-50 flex h-[calc(100%)] w-[100%] items-center justify-center overflow-hidden bg-black/20 p-5"
          >
            <img
              className="relative max-h-[100%] rounded-[16px]"
              src={selectedPost}
              alt=""
            />
          </div>
        )}
      </Map>
    </div>
  );
};
