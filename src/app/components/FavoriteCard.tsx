"use client";
import Image from "next/image";

type FavoriteCardProps = {
  image: string;
  title: string;
  price: string | number;
  href: string; // /products/[slug]
};

export default function FavoriteCard({ image, title, price, href }: FavoriteCardProps) {
  return (
    <a href={href} className="block group">
      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform" />
      </div>
      <h3 className="mt-2 font-medium">{title}</h3>
      <p className="text-gray-600">{price} TL</p>
    </a>
  );
}