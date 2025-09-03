export default function Hero() {
  return (
    <section
      className="relative h-[400px] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: "url('/clothes_hanging_in_store.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Seçili Ürünlerde %40 İndirim
        </h2>
        <button className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
          Alışverişe Başla
        </button>
      </div>
    </section>
  );
}