import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../utils/supabase";

const OrderDetail = () => {
  const { id } = useParams();
  const orderId = id;

  const [orders, setOrders] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let { data, error } = await supabase
          .from('orders')
          .select("*")
          .eq('id', orderId);

        if (error) {
          throw error;
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full h-full flex justify-center center">
      {orders?.map((order) => (
        <div key={order.id} className="bg-white grid">
          <p className="text-sm text-text-100 border-b">orden #: {order.id}</p>
          <p>Contratista: {order.contractor}</p>
          <p>Despachador: {order.dispatcher}</p>
          <p>Responsable:{order.responsible}</p>
          <p>{order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderDetail;