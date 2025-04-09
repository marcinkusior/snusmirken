import { useMemo, useRef, useState } from "react";
import Supercluster from "supercluster";
import Map, { Marker, Popup, MapRef } from "react-map-gl/maplibre";
import { Post } from "@prisma/client";
import "./NewMap.css";

import "maplibre-gl/dist/maplibre-gl.css";
import { Gallery } from "./Gallery";
import { AutoFitBounds } from "./AutoFitBounds";

interface ClusterProperties {
  clusterId: number;
  pointCount: number;
  mostImportantImage: string;
  mostImportantName: string;
}

export const NewMapComponent = ({
  posts,
  selectedTripFragmentId,
}: {
  posts: Post[];
  selectedTripFragmentId: number;
}) => {
  const mapRef = useRef<MapRef>(null);
  const [viewport, setViewport] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 13,
  });

  const [popupInfo, setPopupInfo] = useState<Post | null>(null);
  const [selectedClusterImages, setSelectedClusterImages] = useState<Post[]>(
    [],
  );

  // Pre-process locations to include importance in the feature properties
  const points = useMemo(
    () =>
      posts.map((post, index) => ({
        type: "Feature" as const,
        properties: {
          ...post,
          importance: index,
          mostImportantImage: post.imageUrl,
          mostImportantName: post.name,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [post.longitude ?? 0, post.latitude ?? 0],
        },
      })),
    [posts],
  );

  // Initialize supercluster with optimized settings
  const supercluster = useMemo(() => {
    const cluster = new Supercluster<
      Post & { mostImportantImage: string; mostImportantName: string },
      ClusterProperties
    >({
      radius: 40,
      maxZoom: 19,
      minPoints: 2,
      map: (props) => ({
        importance: props.importance,
        mostImportantImage: props.imageUrl,
        mostImportantName: props.name,
      }),
      reduce: (accumulated, props) => {
        if (
          !accumulated.importance ||
          props.importance > accumulated.importance
        ) {
          accumulated.importance = props.importance;
          accumulated.mostImportantImage = props.mostImportantImage;
          accumulated.mostImportantName = props.mostImportantName;
        }
      },
    });

    cluster.load(points);
    return cluster;
  }, [points]);

  // Get clusters only for the visible area
  const clusters = useMemo(() => {
    const bounds = mapRef.current?.getBounds().toArray().flat();
    if (!bounds) return [];

    return supercluster.getClusters(bounds, Math.floor(viewport.zoom));
  }, [supercluster, viewport.zoom, viewport.latitude, viewport.longitude]);

  const handleClusterClick = (clusterId: number) => {
    const leaves = supercluster.getLeaves(clusterId, Infinity);
    const clusterPosts = leaves.map(
      (leaf) => leaf.properties as unknown as Post,
    );
    setSelectedClusterImages(clusterPosts);
  };

  const AutoFitPosts = useMemo(() => {
    if (!selectedTripFragmentId) return posts;
    return posts.filter(
      (post) => post.tripFragmentId === selectedTripFragmentId,
    );
  }, [posts, selectedTripFragmentId]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Map
        ref={mapRef}
        mapLib={import("maplibre-gl")}
        style={{ width: "100%", height: "100%" }}
        onMove={(evt) => {
          setViewport(evt.viewState);
        }}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
        initialViewState={{
          longitude: 139.76204688997245,
          latitude: 35.6796917947184,
          zoom: 12,
        }}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount,
            cluster_id,
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster_id}`}
                latitude={latitude}
                longitude={longitude}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleClusterClick(cluster_id);
                }}
              >
                <div
                  className="cluster-marker cursor-pointer border-primaryColor"
                  style={{
                    backgroundImage: `url(${cluster.properties.mostImportantImage})`,
                    width: "75px",
                    height: "75px",
                  }}
                >
                  <span>{pointCount}</span>
                </div>
              </Marker>
            );
          }

          const location = cluster.properties;

          return (
            <Marker
              key={location.id}
              latitude={latitude}
              longitude={longitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedClusterImages([location as unknown as Post]);
              }}
            >
              <div className="marker cursor-pointer">
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="h-[75px] w-[75px] rounded-full border-borderColor object-cover"
                />
              </div>
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            latitude={popupInfo.latitude ?? 0}
            longitude={popupInfo.longitude ?? 0}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
          >
            <div className="p-2">
              <img
                src={popupInfo.imageUrl ?? ""}
                alt={popupInfo.name ?? ""}
                className="w-48 rounded-lg object-cover"
              />
            </div>
          </Popup>
        )}

        <AutoFitBounds posts={AutoFitPosts} />
      </Map>

      <Gallery
        images={selectedClusterImages}
        handleClickOutside={() => {
          setSelectedClusterImages([]);
        }}
      />
    </div>
  );
};
