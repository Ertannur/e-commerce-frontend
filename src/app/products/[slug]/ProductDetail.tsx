"use client";
import React, { useState } from "react";

type Product = {
  slug: string;
  title: string;
  price: string;
  images: string[];
  description: string;
  fabric: string;
  measures: string;
  code: string;
  colors: string[];
  sizes: string[];
};

type ProductDetailProps = {
  product: Product;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  return (
    <main className="px-6 py-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
      <nav className="text-sm text-gray-500 mb-6 md:col-span-2 text-right">
        Anasayfa &gt; Kadın &gt; Jean &gt; {product.title}
      </nav>

      {/* Sol: görseller */}
      <div className="space-y-4">
        <img 
          src={mainImage} 
          alt={product.title} 
          className="rounded-lg w-full object-cover max-h-[500px]" 
        />
        <div className="grid grid-cols-3 gap-4">
          {product.images.slice(1).map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`${product.title} ${idx + 1}`} 
              className="rounded-lg w-full cursor-pointer object-cover max-h-[100px]"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Sağ: ürün detayları */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-2xl font-semibold text-blue-600">{product.price}</p>
        </div>

        {/* Renkler */}
        <div>
          <h3 className="font-medium mb-3">Renkler</h3>
          <div className="flex gap-3">
            {product.colors.map((color, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                style={{ backgroundColor: color }}
                title={`Renk ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bedenler */}
        <div>
          <h3 className="font-medium mb-3">Beden</h3>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-32"
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Sepete Ekle */}
        <button className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors">
          Sepete Ekle
        </button>

        {/* Ürün bilgileri */}
        <div className="space-y-4 pt-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Açıklama</h4>
            <p className="text-gray-600 text-sm">{product.description}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Kumaş</h4>
            <p className="text-gray-600 text-sm">{product.fabric}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Ölçüler</h4>
            <p className="text-gray-600 text-sm">{product.measures}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Ürün Kodu</h4>
            <p className="text-gray-600 text-sm">{product.code}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
