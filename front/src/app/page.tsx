
import { ListBooksTable } from "@/components/list-books.table";
import { CardSwipe } from "@/components/ui/card-swipe";

export default function Home() {
  const images = [
    { src: "https://m.media-amazon.com/images/I/81hCVEC0ExL._SL1500_.jpg", alt: "Image 1" },
    { src: "https://m.media-amazon.com/images/I/91pI+R+GE7L._SL1500_.jpg", alt: "Image 2" },
    { src: "https://m.media-amazon.com/images/I/7143D7foVmL._SL1500_.jpg", alt: "Image 3" },
  ]

  return (
    <div className="w-full h-dvh grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-4 overflow-y-auto">
      <div className="flex items-center justify-center col-span-1 lg:col-span-6 xl:col-span-4 p-4">
        <CardSwipe autoplayDelay={3000} slideShadows={false} />
      </div>
      <div className="flex items-center justify-center col-span-1 lg:col-span-6 xl:col-span-8 p-4">
        <ListBooksTable />
      </div>
    </div>
  );
}
