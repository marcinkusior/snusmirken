import maplibregl from "maplibre-gl";
import React from "react";
import Map, { useMap } from "react-map-gl/maplibre";
import { PostFormValues } from "~/app/_types/PostFormValues";

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
        padding: 50,
        duration: 3800,
        curve: 3.4,
        // easing: (t) => {
        //   // quadratic ease-in-out function (much less gentle)
        //   return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        // },
      });
    }
  }, [posts, map]);

  return null;
};
