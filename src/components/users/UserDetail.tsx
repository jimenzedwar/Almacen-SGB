import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import userStore, { Order, User } from "../../utils/ZustandStore";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const orders = userStore((state) => state.orders);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const users = userStore((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
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
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const ordersbyUser = useMemo(() => {
    if (user?.role === 'admin') {
      return orders.filter(order => order.responsible === user?.id);
    } else if (user?.role === 'user') {
      return orders.filter(order => order.dispatcher === user?.id);
    }
    return orders;
  }, [orders, user]);

  const filteredOrders = useMemo(() => {
    const searchLower = searchText.toLowerCase();
    return ordersbyUser.filter(order => 
      order.id.toString().toLowerCase().includes(searchLower) ||
      order.contractor.toLowerCase().includes(searchLower) ||
      order.dispatcher.toLowerCase().includes(searchLower) ||
      order.responsible.toLowerCase().includes(searchLower)
    );
  }, [ordersbyUser, searchText]);

  const ordersPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = useMemo(() => {
    return filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  }, [filteredOrders, currentPage]);


  const getUserNameById = useCallback((userId: string) => {
    const user = users.find((user) => user.id === userId.toString());
    return user ? user.full_name : "Desconocido";
  }, [users]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="relative w-full font-Manrope text-text-50">
      <p className="text-2xl text-text-50 border-b p-3">{user?.role === "user" ? "Despachador" : "Administrador"}</p>
      <div className="grid mt-5 p-5 mx-5">
        <p className="font-semibold text-lg">Nombre: <span className="font-normal text-text-100"> {user?.full_name}</span> </p>
        <p className="font-semibold text-lg">Identificacion: <span className="font-normal text-text-100">{user?.identification}</span></p>
      </div>
      <div className="flex p-3 mx-5">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-2 py-1 rounded-xl border border-gray-300 placeholder:text-text-100 focus:ring-0 focus:border-gray-300"
        />
      </div>
      <OrderList
        orders={currentOrders}
        getUserNameById={getUserNameById}
        navigate={navigate}
      />

      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white"}`}
        >
          <span className="icon-[solar--round-arrow-left-linear] text-2xl flex items-center"></span>
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white"}`}
        >
          <span className="icon-[solar--round-arrow-right-linear] text-2xl flex items-center"></span>
        </button>
      </div>
    </div>
  );
};

interface OrderListProps {
  orders: Array<Order>;
  getUserNameById: (userId: string) => string;
  navigate: (path: string) => void;
}

const OrderList = ({ orders, getUserNameById, navigate }: OrderListProps) => {
  return (
    <div className="m-5 bg-white rounded-lg grid-cols-2 lg:grid-cols-5 text-text-100 grid">
      <p className="p-3 text-sm">Orden #</p>
      <p className="py-3 text-sm hidden lg:block">Estado</p>
      <p className="py-3 text-sm">Contratista</p>
      <p className="py-3 text-sm hidden lg:block">Responsable</p>
      <p className="py-3 text-sm hidden lg:block">Despachador</p>
      <span className="border-b col-span-2 lg:col-span-5 block mx-4"></span>
      {orders.map((order) => (
        <div key={order.id} className="bg-white col-span-2 lg:col-span-5 text-text-50 hover:bg-gray-100 rounded-lg" onClick={() => navigate(`/order/${order.id}`)}>
          <div className="justify-between grid grid-cols-2 lg:grid-cols-5 py-3">
            <h2 className="text-lg px-3">{order.id}</h2>
            <p className={`w-fit rounded-full px-2 py-1 hidden lg:block ${order.status === "pending" ? "bg-gray-100 text-gray-500 " : "bg-green-100 text-green-400"}`}>
              {order.status === "pending" ? "Pendiente" : "Completada"}
            </p>
            <p className="text-sm ">
              {order.contractor}
            </p>
            <p className="text-sm hidden lg:block ">
              {getUserNameById(order.responsible)}
            </p>
            <p className="text-sm hidden lg:block">
              {getUserNameById(order.dispatcher)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDetail;