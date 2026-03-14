import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { GalleryItem } from "../../backend";
import { getBlobUrl } from "../../hooks/useFileUpload";
import { useLanguage } from "../../hooks/useLanguage";
import { useGallery } from "../../hooks/useQueries";
import { tr, translations } from "../../translations";

const PLACEHOLDER_IMAGES = [
  {
    id: "p1",
    src: "/assets/generated/activity-eye-camp.dim_600x400.jpg",
    caption: "Eye Camp",
  },
  {
    id: "p2",
    src: "/assets/generated/activity-food.dim_600x400.jpg",
    caption: "Food Distribution",
  },
  {
    id: "p3",
    src: "/assets/generated/activity-education.dim_600x400.jpg",
    caption: "Education Support",
  },
  {
    id: "p4",
    src: "/assets/generated/hero-banner.dim_1400x700.jpg",
    caption: "Community Service",
  },
];

function GalleryItemView({
  item,
  index,
  onClick,
}: {
  item: { id: string; src: string; caption?: string };
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square bg-muted"
      onClick={onClick}
      data-ocid={`gallery.item.${index + 1}`}
    >
      <img
        src={item.src}
        alt={item.caption ?? "Gallery image"}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/50 transition-all duration-300 flex items-center justify-center">
        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs font-medium">{item.caption}</p>
        </div>
      )}
    </motion.button>
  );
}

export default function GallerySection() {
  const { lang } = useLanguage();
  const t = translations.gallery;
  const { data: galleryItems, isLoading } = useGallery();
  const [resolvedItems, setResolvedItems] = useState<
    { id: string; src: string; caption?: string }[]
  >([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (galleryItems && galleryItems.length > 0) {
      Promise.all(
        galleryItems.map(async (item: GalleryItem) => {
          const src = await getBlobUrl(item.blobId).catch(() => "");
          return { id: item.id, src, caption: item.caption };
        }),
      ).then(setResolvedItems);
    } else if (!isLoading) {
      setResolvedItems(PLACEHOLDER_IMAGES);
    }
  }, [galleryItems, isLoading]);

  const displayItems =
    resolvedItems.length > 0 ? resolvedItems : PLACEHOLDER_IMAGES;
  const lightboxItem =
    lightboxIndex !== null ? displayItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 text-secondary text-sm font-semibold uppercase tracking-widest mb-3">
            <span className="w-8 h-0.5 bg-secondary" />
            {tr(t.title, lang)}
            <span className="w-8 h-0.5 bg-secondary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {tr(t.title, lang)}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {tr(t.subtitle, lang)}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {["a", "b", "c", "d"].map((k) => (
              <div
                key={k}
                className="aspect-square bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {displayItems.map((item, i) => (
              <GalleryItemView
                key={item.id}
                item={item}
                index={i}
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Dialog open onOpenChange={(open) => !open && setLightboxIndex(null)}>
            <DialogContent
              className="max-w-3xl w-full p-0 bg-black border-none overflow-hidden"
              data-ocid="gallery.dialog"
            >
              <DialogTitle className="sr-only">Gallery Image</DialogTitle>
              {lightboxItem && (
                <div className="relative">
                  <img
                    src={lightboxItem.src}
                    alt={lightboxItem.caption ?? "Gallery"}
                    className="w-full max-h-[80vh] object-contain"
                  />
                  {lightboxItem.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                      <p className="text-white text-sm">
                        {lightboxItem.caption}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
