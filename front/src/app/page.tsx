import { CardSwipe } from "@/components/ui/card-swipe";

export default function Home() {
  const images = [
    { src: "https://m.media-amazon.com/images/I/81hCVEC0ExL._SL1500_.jpg", alt: "Image 1" },
    { src: "https://m.media-amazon.com/images/I/91pI+R+GE7L._SL1500_.jpg", alt: "Image 2" },
    { src: "https://m.media-amazon.com/images/I/7143D7foVmL._SL1500_.jpg", alt: "Image 3" },
  ]

  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <CardSwipe images={images} autoplayDelay={3000} slideShadows={false} />
    </div>
  );
}
