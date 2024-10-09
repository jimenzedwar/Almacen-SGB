import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../utils/supabase";

const ProductDetail = () => {
  const { id } = useParams();
  const productId = id;

  const [product, setProduct] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let { data, error } = await supabase
          .from('products')
          .select("*")
          .eq('id', productId);

        if (error) {
          throw error;
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full h-full flex justify-center center">
      {product?.map((product) => (
        <div key={product.id} className="bg-white grid">
          <p className="text-sm text-text-100 border-b">Producto #: {product.id}</p>
          <p>Nombre: {product.product_name}</p>
          <p>Medida: {product.product_measurement}</p>
          <p>Cantidad:{product.quantity}</p>
          <p>{product.photo}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductDetail;