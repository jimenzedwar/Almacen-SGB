import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";

interface Product {
  id: number;
  product_name: string;
  product_measurement: string;
  quantity: number;
  photo: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id;
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Omit<Product, 'id'>>({
    product_name: "",
    product_measurement: "",
    quantity: 0,
    photo: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select("*")
          .eq('id', productId)
          .single();

        if (error) {
          throw error;
        }

        setProduct(data);
        setEditedProduct({
          product_name: data.product_name,
          product_measurement: data.product_measurement,
          quantity: data.quantity,
          photo: data.photo,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('products')
        .update(editedProduct)
        .eq('id', productId);

      if (error) {
        throw error;
      }

      setProduct((prev) => prev ? { ...prev, ...editedProduct } : null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }, [editedProduct, productId]);

  const handleDelete = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw error;
      }

      navigate('/stock');
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }, [productId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex justify-center items-center font-Manrope text-text-50 ">
      {product && (
        <div key={product.id} className="bg-white grid p-5 rounded-lg mt-12 border shadow-md">
          <p className="text-sm text-text-100 border-b">Producto #: {product.id}</p>
          <p className="text-xl mt-4">{product.product_name}</p>
          <p className="text-sm text-text-100">Medida: {product.product_measurement}</p>
          <img className="rounded-md h-80 aspect-square my-3" src={product.photo} alt={product.product_name}></img>
          {isEditing ? (
            <div className="grid space-y-5">
              <input
                type="text"
                name="product_name"
                value={editedProduct.product_name}
                onChange={handleEditChange}
                className="p-2 border-b border-0 border-text-100 focus:ring-0 focus:border-text-100"
              />
              <input
                type="text"
                name="product_measurement"
                value={editedProduct.product_measurement}
                onChange={handleEditChange}
                className="p-2 border-b border-0 border-text-100 focus:ring-0 focus:border-text-100"
              />
              <input
                type="number"
                name="quantity"
                value={editedProduct.quantity}
                onChange={handleEditChange}
                className="p-2 border-b border-0 border-text-100 focus:ring-0 focus:border-text-100"
              />
              <div className=" flex justify-between mt-5">
                <button onClick={() => setIsEditing(false)} className="bg-red-200 text-red-500 p-2 rounded w-fit">Cancelar</button>
                <button onClick={handleSave} className="bg-green-100 text-green-400 p-2 rounded w-fit">Guardar</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-lg">Cantidad: {product.quantity}</p>
              <div className="flex justify-between mt-5">
                <button onClick={handleDelete} className="bg-red-200 text-red-500 p-2 rounded flex items-center w-fit"><span className="icon-[solar--trash-bin-2-linear] mr-2"></span>Eliminar</button>
                <button onClick={() => setIsEditing(true)} className="bg-secondary-100 text-secondary-50 p-2 rounded flex items-center w-fit"><span className="icon-[solar--pen-linear] mr-2"></span> Editar</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;