import * as React from "react";
import Map, {
  Marker,
  Popup,
  Source,
  Layer,
  useMap,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PostFormValues } from "~/app/_types/PostFormValues";

type FlyToCoordinatesFunction = ({
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

export const AutoFitBounds = ({ posts }) => {
  const { current: map } = useMap();

  const onClick = () => {
    map.flyTo({ center: [-122.4, 37.8], zoom: 10 });
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
  }, [posts]);

  return <button onClick={onClick}>FLYYY</button>;
};

export const FlyToLocation = ({
  setFlyToCoordinates,
}: {
  setFlyToCoordinates: (flyToCoordinate: FlyToCoordinatesFunction) => void;
}) => {
  const { current: map } = useMap();

  const flyToCoordinates = React.useCallback(
    ({ latitude, longitude }: { latitude: number; longitude: number }) => {
      map?.flyTo({
        center: [longitude, latitude],
        zoom: 10,
        duration: 1000,
        curve: 0.84,
        // easing: (t: number): number => {
        //   return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        // },
      });
    },
    [],
  );

  React.useEffect(() => {
    setFlyToCoordinates(() => flyToCoordinates);
  }, [setFlyToCoordinates]);

  return null;
};

export const MapComponent = ({
  latitude,
  longitude,
  posts,
  setFlyToCoordinates,
}: {
  latitude: number;
  longitude: number;
  posts: PostFormValues[];
  setFlyToCoordinates: (flyToCoordinate: FlyToCoordinatesFunction) => void;
}) => {
  const [selectedPost, setSelectedPost] = React.useState<number | null>(null);
  const lineCoordinates = posts.map((post) => [post.longitude, post.latitude]);

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: lineCoordinates,
        },
      },
    ],
  };

  return (
    <div className="flex justify-center">
      <Map
        initialViewState={{
          longitude,
          latitude,
          zoom: 14,
        }}
        style={{ width: 700, height: 400 }}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
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
                latitude={post.latitude!}
                longitude={post.longitude!}
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
    </div>
  );
};
