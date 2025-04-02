import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, DocumentData, Timestamp } from "firebase/firestore";

export interface Product extends DocumentData {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  userName: string;
  userEmail: string;
  category: string;
  createdAt: Timestamp | Date;
}

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Product Data from Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.error("No such product found!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!product) return <p className="text-center mt-4">Product not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-4 mb-4 bg-white shadow-lg rounded-lg">
      {/* Product Image */}
      <div className="flex justify-center">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-[300px] w-auto object-cover md:w-3/4 lg:w-1/2 rounded-lg"
        />
      </div>

      {/* Product Information */}
      <div className="mt-6">
        <h3 className="text-2xl font-bold text-gray-800">{product.title}</h3>

        {/* Price & Offer Button */}
        <div className="flex justify-between items-center mt-3 bg-gray-100 p-4 rounded-lg">
          <p className="text-lg font-semibold text-gray-700">
            Price: <span className="text-blue-600">₹{product.price}</span>
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Make Offer
          </button>
        </div>

        {/* Seller Information */}
        <div className="mt-5 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">Seller</h2>
          <p className="text-gray-600">Name: {product.userName || "Unknown"}</p>
          <p className="text-gray-600">
            Email: {product.userEmail || "No Email Provided"}
          </p>
        </div>

        {/* Product Description */}
        <div className="mt-5 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">Description</h2>
          <p className="text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
