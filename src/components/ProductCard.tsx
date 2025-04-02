import { useNavigate } from "react-router-dom";
import { Product } from "./ProductDetails";
import { Timestamp } from "firebase/firestore";

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Format date based on type
  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  return (
    <div
      className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden relative p-4 cursor-pointer"
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="flex justify-center">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-40 object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="mt-3">
        <div className="text-lg font-bold text-gray-800">{product.title}</div>
        <div className="text-m font-semibold text-gray-600">
          ₹{product.price}
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="text-s text-gray-500">{product.category}</div>
        </div>
      </div>

      {/* Date at Bottom-Right */}
      <div className="absolute bottom-2 right-2 text-sm text-gray-500">
        {product.createdAt ? formatDate(product.createdAt) : "Date not available"}
      </div>
    </div>
  );
};

export default ProductCard;
