"use client";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  slug: string;
  image: string;
  title: string;
  price: string;
};

export default function ProductCard({ slug, image, title, price }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="flex flex-col cursor-pointer group">
      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <h3 className="mt-2 font-medium">{title}</h3>
      <p className="text-gray-600">{price}</p>
    </Link>
  );
}