export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-6 md:px-20">
      <div className="grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-bold mb-2">ShopEase</h4>
          <p>Lorem ipsum dolor sit amet consectetur.</p>
        </div>

        <div>
          <h4 className="font-bold mb-2">Kampanyalar</h4>
          <ul className="space-y-1">
            <li>İndirimli Ürünler</li>
            <li>En Çok Satanlar</li>
            <li>Haftanın Ürünleri</li>
            <li>Yeni Ürünler</li>
            <li>Fırsat Ürünleri</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-2">İletişim</h4>
          <p>0555 555 55 55</p>
          <p>info@shopease.com</p>
        </div>

        <div>
          <h4 className="font-bold mb-2">E-Bültene Kayıt Ol</h4>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="E-mail adresinizi yazınız"
              className="flex-1 px-3 py-2 rounded-md text-black"
            />
            <button className="bg-white text-black px-4 py-2 rounded-md font-semibold">
              Detaylı Bilgi
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        © 2025 ShopEase. Tüm Hakları Saklıdır.
      </div>
    </footer>
  );
}