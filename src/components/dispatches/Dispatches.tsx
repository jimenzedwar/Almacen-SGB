import userStore, { Order } from "../../utils/ZustandStore";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";

const Dispatches = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const navigate = useNavigate();
    const orders = userStore((state) => state.orders);

    // Filtrar órdenes pendientes
    const pendingOrders = useMemo(() => {
        return orders.filter(order => order.status === "pending");
    }, [orders]);

    // Filtrar órdenes pendientes por texto de búsqueda
    const filteredOrders = useMemo(() => {
        const searchLower = searchText.toLowerCase();
        return pendingOrders.filter(order => 
            order.id.toString().toLowerCase().includes(searchLower) ||
            order.contractor.toLowerCase().includes(searchLower) ||
            order.dispatcher.toLowerCase().includes(searchLower) ||
            order.responsible.toLowerCase().includes(searchLower)
        );
    }, [pendingOrders, searchText]);

    const ordersPerPage = 10;
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const currentOrders = useMemo(() => {
        return filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
    }, [filteredOrders, currentPage]);

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }, [totalPages]);

    return (
        <div className="relative w-full font-Manrope text-text-50">
            <p className="text-2xl text-text-50 border-b p-3">Ordenes Pendientes</p>
            <div className="flex mt-5 p-5 justify-between mx-5">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="px-2 rounded-xl border border-gray-300 placeholder:text-text-100 focus:ring-0 focus:border-gray-300"
                />
            </div>
            <OrderList
                orders={currentOrders}
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
    orders: Order[];
    navigate: (path: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, navigate }) => {
    return (
        <div className="m-5 bg-white rounded-lg grid-cols-2 sm:grid-cols-3 text-text-100 grid">
            <p className="p-3 text-sm">Orden #</p>
            <p className="py-3 text-sm hidden sm:block">Estado</p>
            <p className="py-3 text-sm">Contratista</p>
            <span className="border-b col-span-3 block mx-4"></span>
            {orders.map((order) => (
                <div key={order.id} className="bg-white col-span-3 sm:col-span-3 text-text-50 hover:bg-gray-100 rounded-lg" onClick={() => navigate(`/order/${order.id}`)}>
                    <div className="justify-between grid grid-cols-2 sm:grid-cols-3 py-3">
                        <p className="pl-3">{order.id}</p>
                        <p className={`w-fit rounded-full px-2 py-1 hidden sm:block ${order.status === "pending" ? "bg-gray-100 text-gray-500 " : "bg-green-100 text-green-400"}`}>
                            {order.status === "pending" ? "Pendiente" : "Completada"}
                        </p>
                        <p className="text-sm ">
                            {order.contractor}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Dispatches;