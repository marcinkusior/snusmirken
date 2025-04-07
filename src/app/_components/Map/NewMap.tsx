import { useMemo, useRef, useState } from "react";
import Supercluster from "supercluster";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import { Post } from "@prisma/client";
import "./NewMap.css";

import "maplibre-gl/dist/maplibre-gl.css";

export interface Location {
  id: string;
  name: string;
  position: [number, number];
  image: string;
  importance: number;
}

interface ClusterProperties {
  clusterId: number;
  pointCount: number;
  mostImportantImage: string;
  mostImportantName: string;
}
let currentClusters = null;
let clusterRecalculateCounter = 0;

export const NewMapComponent = ({ posts }: { posts: Post[] }) => {
  const mapRef = useRef<Map>(null);
  const [viewport, setViewport] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 13,
  });

  const [popupInfo, setPopupInfo] = useState<Location | null>(null);

  // Pre-process locations to include importance in the feature properties
  const points = useMemo(
    () =>
      posts.map((post, index) => ({
        type: "Feature" as const,
        properties: {
          ...post,
          importance: index,
          mostImportantImage: post.imageUrl,
          mostImportantName: post.title,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [post.longitude, post.latitude],
        },
      })),
    [posts],
  );

  // Initialize supercluster with optimized settings
  const supercluster = useMemo(() => {
    const cluster = new Supercluster<
      Location & { mostImportantImage: string; mostImportantName: string },
      ClusterProperties
    >({
      radius: 40,
      maxZoom: 19,
      minPoints: 2, // Only create clusters with at least 2 points
      map: (props) => ({
        importance: props.importance,
        mostImportantImage: props.imageUrl,
        mostImportantName: props.title,
      }),
      reduce: (accumulated, props) => {
        // Keep track of the most important point during clustering
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
    console.log("bounds", bounds);

    currentClusters = supercluster.getClusters(
      bounds,
      Math.floor(viewport.zoom),
    );
    return currentClusters;
  }, [supercluster, viewport.zoom, viewport.latitude]);

  return (
    <Map
      ref={mapRef}
      mapLib={import("maplibre-gl")}
      style={{ width: "100%", height: "100%" }}
      onMove={(evt) => {
        console.log("evt", evt);
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
            >
              <div
                className="cluster-marker border-primaryColor"
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
              setPopupInfo(location);
            }}
          >
            <div className="marker">
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
          latitude={popupInfo.latitude}
          longitude={popupInfo.longitude}
          onClose={() => setPopupInfo(null)}
          closeButton={true}
        >
          <div className="p-2">
            <img
              src={popupInfo.imageUrl}
              alt={popupInfo.name}
              className="w-48 rounded-lg object-cover"
            />
          </div>
        </Popup>
      )}
    </Map>
  );
};
