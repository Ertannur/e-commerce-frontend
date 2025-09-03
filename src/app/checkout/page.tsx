"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="px-6 py-12 max-w-5xl mx-auto">
        <button
          onClick={() => history.back()}
          className="text-sm text-gray-500 mb-6 hover:underline"
        >
          ← Alışverişe Devam Et
        </button>

        <h1 className="text-2xl font-bold mb-6">Ödeme</h1>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Adres ve Kart Bilgileri */}
          <div className="md:col-span-2 space-y-10">
            {/* Adres */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Adres</h2>
              <input
                type="text"
                placeholder="Adres Başlığı"
                className="w-full border p-2 rounded-md"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ad"
                  className="border p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Soyad"
                  className="border p-2 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-2 rounded-md"
                />
                <input
                  type="tel"
                  placeholder="Telefon"
                  className="border p-2 rounded-md"
                />
              </div>
              <textarea
                placeholder="Adres"
                rows={3}
                className="w-full border p-2 rounded-md"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="İl"
                  className="border p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="İlçe"
                  className="border p-2 rounded-md"
                />
              </div>
            </section>

            {/* Kart Bilgileri */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Kart Bilgileri</h2>
              <input
                type="text"
                placeholder="Kart Numarası"
                className="w-full border p-2 rounded-md"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="GG/AA/YYYY"
                  className="border p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="border p-2 rounded-md"
                />
              </div>
              <input
                type="text"
                placeholder="Ad Soyad"
                className="w-full border p-2 rounded-md"
              />
            </section>

            <button className="w-full bg-black text-white py-3 rounded-md mt-6 hover:bg-gray-800 transition">
              Ödeme
            </button>
          </div>

          {/* Sipariş Özeti */}
          <aside className="space-y-2 border p-4 rounded-md">
            <p className="flex justify-between">
              <span>Sipariş Toplamı</span>
              <span>1000 TL</span>
            </p>
            <p className="flex justify-between">
              <span>Kargo</span>
              <span>100 TL</span>
            </p>
            <p className="flex justify-between font-bold">
              <span>Toplam</span>
              <span>1100 TL</span>
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}