// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductDetail from "./ProductDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

const mockProducts = [
  {
    slug: "loose-straight-jean",
    title: "Loose Straight Jean",
    price: "1000 TL",
    images: ["/clothes_folded.png", "/clothes_hanging_in_store.png", "/clothes_at_beach_scene.png"],
    description: "Denim koleksiyonundan rahat ve şık jean.",
    fabric: "%100 Pamuk",
    measures: "Jean: Bel 26 / Boy: 32",
    code: "15678686865626-856",
    colors: ["#1E3A8A", "#60A5FA"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    slug: "denim-ceket",
    title: "Denim Ceket",
    price: "1500 TL",
    images: ["/clothes_hanging_in_store.png", "/clothes_folded.png"],
    description: "Şık denim ceket, her kombinle uyumlu.",
    fabric: "%100 Pamuk",
    measures: "Manken Boy: 180 cm",
    code: "123456789",
    colors: ["#000000", "#666666"],
    sizes: ["S", "M", "L"],
  },
  {
    slug: "erkek-gömlek",
    title: "Klasik Gömlek",
    price: "800 TL",
    images: ["/clothes_at_beach_scene.png", "/clothes_hanging_in_store.png"],
    description: "Klasik erkek gömleği, resmi ve günlük kullanım için ideal.",
    fabric: "%65 Pamuk, %35 Polyester",
    measures: "Manken Boy: 185 cm",
    code: "EG-003",
    colors: ["#FFFFFF", "#87CEEB"],
    sizes: ["M", "L", "XL"],
  },
  {
    slug: "çocuk-tişört",
    title: "Renkli Tişört",
    price: "300 TL",
    images: ["/clothes_on_line_hanging.png", "/clothes_folded.png"],
    description: "Çocuklar için renkli ve eğlenceli tişört.",
    fabric: "%100 Pamuk",
    measures: "Yaş: 8-12",
    code: "CT-004",
    colors: ["#FF6B6B", "#4ECDC4"],
    sizes: ["8", "10", "12"],
  },
];

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) return notFound();

  return (
    <>
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </>
  );
}