import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { db } from "../firebase/config";
import { collection, getDocs, DocumentData } from "firebase/firestore";

interface Product extends DocumentData {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  userName: string;
  userEmail: string;
  category: string;
  createdAt: Date;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={setSearchQuery} />
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? "No products found matching your search."
                  : "No products available."}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
