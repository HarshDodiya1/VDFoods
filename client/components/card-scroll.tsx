import React from "react";

import { CardCarousel } from "./ui/card-carousel";

export const CardCaroursalDemo = () => {
  const images = [
    { src: "/mirch.jpg", alt: "Image 1" },
    { src: "/termaric.jpg", alt: "Image 2" },
    { src: "/jira.jpg", alt: "Image 3" },
    { src: "/oil.jpg", alt: "Image 3" },
    { src: "/tea.jpg", alt: "Image 3" },
  ];

  return (
    <div className="w-full ">
      <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  );
};
