export default function Recycle() {
  return (
    <section 
      className="py-12 text-center relative"
      style={{
        backgroundImage: "url('/clothes_folded.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/80"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-semibold mb-4">Geri Dönüştür & Kazan</h3>
        <p className="max-w-xl mx-auto text-gray-600 mb-6">
          Kullanmadığın kıyafetleri gönder, ShopEase puanı olarak indirim kazan
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
          Detaylı Bilgi İçin
        </button>
      </div>
    </section>
  );
}