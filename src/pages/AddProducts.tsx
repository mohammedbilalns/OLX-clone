import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface FormData {
  title: string;
  category: string;
  price: string;
  description: string;
  image: File | null;
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxbn6tmy7/image/upload";
const UPLOAD_PRESET = "olx-clone";

const AddProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    price: "",
    description: "",
    image: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      toast.error("Please login to add a product!");
      navigate("/");
      return;
    }

    if (!formData.image) {
      toast.error("Please select an image for the product!");
      setLoading(false);
      return;
    }

    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(formData.image);

      const productData = {
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        imageUrl: imageUrl,
        createdAt: new Date(),
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
      };

      await addDoc(collection(db, "products"), productData);
      toast.success("Product added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Add New Product
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white font-bold py-2 mt-4 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300"
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddProducts;
