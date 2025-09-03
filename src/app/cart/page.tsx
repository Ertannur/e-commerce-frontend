"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  code?: string;
}

export default function CartPage() {
  const router = useRouter();
  // Şimdilik boş array (mock yok)
  const [cartItems] = useState<CartItem[]>([]);

  const shippingCost = 100;
  const orderTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const grandTotal = orderTotal + shippingCost;

  return (
    <>
      <Header />
      <main className="px-6 py-12 max-w-7xl mx-auto">
        <nav className="text-sm text-gray-500 mb-8">
          Anasayfa &gt; <span className="text-black">Sepetim</span>
        </nav>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Sepetiniz şu anda boş.</p>
        ) : (
          <>
            {/* Tablo başlığı */}
            <div className="grid grid-cols-4 font-semibold text-gray-700 border-b pb-2 mb-4">
              <span>Ürün</span>
              <span>Fiyat</span>
              <span>Adet</span>
              <span className="text-right">Toplam</span>
            </div>

            {/* Ürünler */}
            <div className="divide-y">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-4 items-center py-4 gap-4"
                >
                  {/* Ürün bilgisi */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-sm text-gray-500">
                        Ürün Kodu: {item.code}
                      </p>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        Beden: {item.size}
                      </p>
                    </div>
                  </div>

                  {/* Fiyat */}
                  <p className="font-medium">{item.price} TL</p>

                  {/* Adet */}
                  <p>{item.quantity}</p>

                  {/* Toplam */}
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      {item.price * item.quantity} TL
                    </p>
                    <button className="text-red-500 text-sm hover:underline">
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sepet toplamı */}
            <div className="mt-10 border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Sepet Toplamı</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p>
                    Sipariş Toplamı:{" "}
                    <span className="font-medium">{orderTotal} TL</span>
                  </p>
                  <p>
                    Kargo:{" "}
                    <span className="font-medium">{shippingCost} TL</span>
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-lg font-semibold">
                    Toplam: {grandTotal} TL
                  </p>
                  <button
                    onClick={() => router.push("/checkout")}
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    Satın Al
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
