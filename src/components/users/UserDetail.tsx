import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import userStore, { User } from "../../utils/ZustandStore";

const UserDetail = () => {
  const { id } = useParams();
  const userId = id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>("");
  const orders = userStore((state) => state.orders);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let { data, error } = await supabase
          .from('users')
          .select("*")
          .eq('id', userId);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setUser(data[0]);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  let ordersbyUser = orders;

  if (user?.role === 'admin') {
    ordersbyUser = orders.filter(order => order.responsible === user?.id);
  } else if (user?.role === 'user') {
    ordersbyUser = orders.filter(order => order.dispatcher === user?.id);
  }

  const filteredOrders = ordersbyUser.filter(order => {
    const searchLower = searchText.toLowerCase();
    return (
      order.id.toString().toLowerCase().includes(searchLower) ||
      order.contractor.toLowerCase().includes(searchLower) ||
      order.dispatcher.toLowerCase().includes(searchLower) ||
      order.responsible.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="relative w-full font-Manrope text-text-50">
      <p className="text-2xl text-text-50 border-b p-3">{user?.role}</p>
      <div className="grid space-x-2 mt-5 p-5 justify-center lg:justify-between mx-5">
        <p>Nombre: {user?.full_name}</p>
        <p>Identificacion: {user?.identification}</p>
      </div>
      <div className="flex space-x-2 mt-5 p-5 justify-center lg:justify-between mx-5">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-2 py-1 rounded-xl border border-gray-300 placeholder:text-text-100 focus:ring-0 focus:border-gray-300"
        />
        <span className="border mx-5 hidden lg:block"></span>
      </div>
      <div className="m-5 bg-white rounded-lg grid-cols-5 text-text-100 hidden lg:grid ">
        <p className="p-3 text-sm">Orden #</p>
        <p className="py-3 text-sm">Estado</p>
        <p className="py-3 text-sm">Contratista</p>
        <p className="py-3 text-sm">Responsable</p>
        <p className="py-3 text-sm">Despachador</p>
        <span className=" border-b col-span-5 block mx-4"></span>
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white col-span-5 text-text-50 hover:bg-gray-100" onClick={() => navigate(`/order/${order.id}`)}>
            <div className=" justify-between grid grid-cols-5 py-3">
              <h2 className="text-lg px-3">{order.id}</h2>
              <p className={` w-fit rounded-full px-2 py-1 ${order.status === "pending" ? "bg-gray-100 text-gray-500 " : "bg-green-100 text-green-400"}`}>
                {order.status === "pending" ? "Pendiente" : "Completada"}
              </p>
              <p className="text-sm ">
                {order.contractor}
              </p>
              <p className="text-sm ">
                {order.responsible}
              </p>
              <p className="text-sm ">
                {order.dispatcher}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetail;