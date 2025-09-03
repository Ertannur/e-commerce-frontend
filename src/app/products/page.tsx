import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";

const mockProducts = [
  {
    slug: "loose-straight-jean",
    images: ["/clothes_folded.png"],
    title: "Loose Straight Jean",
    price: "1000 TL",
    category: "kadin"
  },
  {
    slug: "denim-ceket",
    images: ["/clothes_hanging_in_store.png"],
    title: "Denim Ceket",
    price: "1500 TL",
    category: "kadin"
  },
  {
    slug: "erkek-gömlek",
    images: ["/clothes_at_beach_scene.png"],
    title: "Klasik Gömlek",
    price: "800 TL",
    category: "erkek"
  },
  {
    slug: "çocuk-tişört",
    images: ["/clothes_on_line_hanging.png"],
    title: "Renkli Tişört",
    price: "300 TL",
    category: "cocuk"
  }
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  
  // Kategoriye göre filtreleme
  const filteredProducts = category 
    ? mockProducts.filter(product => product.category === category)
    : mockProducts;

  const getCategoryTitle = (category?: string) => {
    switch(category) {
      case 'kadin': return 'Kadın Ürünleri';
      case 'erkek': return 'Erkek Ürünleri';
      case 'cocuk': return 'Çocuk Ürünleri';
      case 'outlet': return 'Outlet Ürünler';
      case 'recycle': return 'Geri Dönüştürülmüş Ürünler';
      default: return 'Tüm Ürünler';
    }
  };

  return (
    <>
      <Header />
      <main className="px-6 py-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{getCategoryTitle(category)}</h1>
          <p className="text-gray-600">{filteredProducts.length} ürün bulundu</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              image={product.images[0]}
              title={product.title}
              price={product.price}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
