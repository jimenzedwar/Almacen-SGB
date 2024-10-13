// src/orders/OrderDetail.tsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import { Products } from "./NewOrderForm";
import useStore from "../../utils/ZustandStore";

interface Order {
  id: string;
  contractor: string;
  responsible: string;
  dispatcher: string;
  status: string;
  products: Products[];
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id;

  const [orders, setOrders] = useState<Order[] | null>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const users = useStore((state) => state.users);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
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

  const getUserNameById = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.full_name : "Desconocido";
  };

  const memoizedGetUserNameById = useMemo(() => getUserNameById, [users]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex justify-center center font-Manrope">
      {orders?.map((order) => (
        <div key={order.id} className="bg-white w-full m-10 rounded-lg">
          <div className="flex justify-between p-3 text-sm text-text-100 border-b items-center">
            <p className="">Orden #: {order.id}</p>
            <p className={`justify-self-end w-fit rounded-full px-2 py-1 ${order.status === "pending" ? "bg-gray-100 text-gray-500 " : "bg-green-100 text-green-400"}`}>{order.status === "pending" ? 'Pendiente' : 'Completada'}</p>
          </div>
          <div className=" p-3 lg:p-5 space-y-2 text-text-50">
            <p className="font-medium">Contratista: {order.contractor}</p>
            <p className="hidden lg:block font-medium">Responsable: {memoizedGetUserNameById(order.responsible)}</p>
            <p className="hidden lg:block font-medium">Despachador: {memoizedGetUserNameById(order.dispatcher)}</p>
            <div className="lg:m-5 bg-white rounded-lg grid-cols-2 sm:grid-cols-3 text-text-100 grid">
              <p className="p-3 text-sm hidden sm:block">Id</p>
              <p className="py-3 text-sm">Producto</p>
              <p className="py-3 text-sm">Cantidad</p>
              <span className=" border-b col-span-2 sm:col-span-3 block"></span>
              {order.products.map((product) => (
                <div key={product.id} className="bg-white col-span-3 text-text-50 hover:bg-gray-100" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="justify-between grid grid-cols-2 sm:grid-cols-3 py-3 items-center">
                    <p className="text-sm px-3 hidden sm:block">{product.id}</p>
                    <p className="text-sm ">
                      {product.product_name}
                    </p>
                    <p className="text-sm">
                      {product.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetail;