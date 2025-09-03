import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/outline";

export default function FavoritesPage() {
  return (
    <>
      <Header />
      <main className="px-6 py-12 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          Anasayfa &gt; <span className="text-black">Favorilerim</span>
        </nav>

        <h1 className="text-2xl font-bold mb-6">Favorilerim</h1>

        {/* Boş-durum (şimdilik veri yokken) */}
        <div className="flex flex-col items-center justify-center border rounded-lg py-16 bg-gray-50">
          <HeartIcon className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-gray-600 mb-4">Henüz favorilere eklediğiniz ürün yok.</p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Ürünleri Keşfet
          </Link>
        </div>

        {/* İLERİDE (backend bağlanınca) favori ürünleri burada listeleyeceksin:
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {favorites.map(item => (
              <FavoriteCard key={item.id} {...item} />
            ))}
          </div>
        </section>
        */}
      </main>
      <Footer />
    </>
  );
}