import { Post } from "@prisma/client";

export const Gallery = ({
  images,
  handleClickOutside,
}: {
  images: Post[];
  handleClickOutside: () => void;
}) => {
  if (images.length === 0) return null;

  return (
    <div
      className="z-9 open-animation absolute inset-0 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <div className="flex max-h-[100%] max-w-[90%] overflow-y-auto rounded-[20px] border-4 border-borderColor bg-white/90 p-6">
        <div className="flex h-full flex-row flex-wrap justify-center gap-6">
          {images?.map((point) => (
            <div
              key={point.id}
              className="flex max-h-[50%] max-w-[30%] items-center justify-center overflow-hidden"
            >
              <img
                src={point.imageUrl ?? ""}
                alt={point.name}
                className="max-h-full max-w-full rounded-[10px] object-contain"
              />
            </div>
          ))}
        </div>

        {/* {modalContent.type === "point" || modalContent.expandedImage ? (
            <div className="flex justify-center">
              <img
                src={
                  modalContent.expandedImage?.image ||
                  modalContent.location?.image
                }
                alt={
                  modalContent.expandedImage?.name ||
                  modalContent.location?.name
                }
                className="max-h-[70vh] max-w-full rounded-lg object-contain"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modalContent.clusterPoints?.map((point) => (
                <div
                  key={point.id}
                  className="flex cursor-pointer items-center justify-center"
                  onClick={(e) => handleImageClick(e, point)}
                >
                  <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden">
                    <img
                      src={point.image}
                      alt={point.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          )} */}
      </div>
    </div>
  );
};
