export default function Collection() {
  return (
    <section className="py-12 text-center">
      <h3 className="text-2xl font-semibold mb-6">Yeni | Yaz Koleksiyonu</h3>
      <div 
        className="relative h-[400px] flex items-end justify-center rounded-lg shadow-md mx-4"
        style={{
          backgroundImage: "url('/clothes_at_beach_scene.png'), url('/clothes_on_line_hanging.png')",
          backgroundSize: "50% 100%, 50% 100%",
          backgroundPosition: "left center, right center",
          backgroundRepeat: "no-repeat, no-repeat"
        }}
      >
        <button className="mb-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
          Şimdi Keşfet
        </button>
      </div>
    </section>
  );
}