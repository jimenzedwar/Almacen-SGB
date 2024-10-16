import { useState, useMemo, useCallback } from "react";
import userStore from "../../utils/ZustandStore";
import { useNavigate } from "react-router-dom";

enum OrdersStatusFilter {
    Pending = 'pending',
    Completed = 'completed',
    All = 'All',
}

const Orders = () => {
    const [status, setStatus] = useState<OrdersStatusFilter>(OrdersStatusFilter.All);
    const [searchText, setSearchText] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const users = userStore((state) => state.users);
    
    const navigate = useNavigate();
    const orders = userStore((state) => state.orders);

    const filteredOrders = useMemo(() => {
        const searchLower = searchText.toLowerCase();
        return orders.filter(order => (
            (status === OrdersStatusFilter.All || order.status === status) &&
            (order.id.toString().toLowerCase().includes(searchLower) ||
            order.contractor.toLowerCase().includes(searchLower) ||
            order.dispatcher.toLowerCase().includes(searchLower) ||
            order.responsible.toLowerCase().includes(searchLower)
        )));
    }, [orders, status, searchText]);

    const ordersPerPage = 10;
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const currentOrders = useMemo(() => {
        return filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
    }, [filteredOrders, currentPage, ordersPerPage]);

    const getUserNameById = useCallback((userId: string) => {
        const user = users.find((user) => user.id === userId.toString());
        return user ? user.full_name : "Desconocido";
    }, [users]);

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }, [totalPages]);

    return (
        <div className="relative w-full font-Manrope text-text-50">
            <p className="text-2xl text-text-50 border-b p-3">Ordenes</p>
            <div className="flex mt-5 p-5 justify-between mx-5">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="px-2 rounded-xl border border-gray-300 placeholder:text-text-100 focus:ring-0 focus:border-gray-300"
                />
                <button className="bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white rounded-lg p-2 text-lg flex items-center lg:hidden" onClick={()=> navigate("/newOrder")}>
                <span className="icon-[icons8--plus] text-xl mx-1 "></span>
                <span className="hidden sm:block ">Nueva Orden</span></button>
                <span className="border mx-5 hidden lg:block"></span>
                <button
                    onClick={() => setStatus(OrdersStatusFilter.All)}
                    className={`p-2 rounded-lg text-xl hidden lg:block ${
                        status === OrdersStatusFilter.All
                            ? "bg-secondary-50 text-primary-50"
                            : "bg-secondary-100 text-secondary-50"
                    }`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setStatus(OrdersStatusFilter.Pending)}
                    className={`p-2 rounded-lg lg:flex items-center text-xl hidden ${
                        status === OrdersStatusFilter.Pending
                            ? "bg-secondary-50 text-primary-50"
                            : "bg-secondary-100 text-secondary-50"
                    }`}
                >
                    <span className="icon-[solar--clock-circle-linear] mx-1"></span>
                    Pendientes
                </button>
                <button
                    onClick={() => setStatus(OrdersStatusFilter.Completed)}
                    className={`p-2 rounded-lg lg:flex items-center text-xl hidden  ${
                        status === OrdersStatusFilter.Completed
                            ? "bg-secondary-50 text-primary-50"
                            : "bg-secondary-100 text-secondary-50"
                    }`}
                >
                    <span className="icon-[solar--check-read-line-duotone] mx-1"></span>
                    Completadas
                </button>
                
            </div>
            <div className="m-5 bg-white rounded-lg grid-cols-5 text-text-100 hidden lg:grid">
                <p className="p-3 text-sm">Orden #</p>
                <p className="py-3 text-sm">Estado</p>
                <p className="py-3 text-sm">Contratista</p>
                <p className="py-3 text-sm">Responsable</p>
                <p className="py-3 text-sm">Despachador</p>
                <span className=" border-b col-span-5 block mx-4"></span>
            {currentOrders.map((order) => ( 
                <div key={order.id} className="bg-white col-span-5 text-text-50 hover:bg-gray-100 rounded-lg" onClick={()=> navigate(`/order/${order.id}`)}>
                    <div className=" justify-between grid grid-cols-5 py-3">
                        <h2 className="text-lg px-3">{order.id}</h2>
                        <p className={` w-fit rounded-full px-2 py-1 ${order.status === "pending" ? "bg-gray-100 text-gray-500 " : "bg-green-100 text-green-400"}`}>
                            {order.status === "pending" ? "Pendiente" : "Completada"}
                        </p>
                        <p className="text-sm ">
                            {order.contractor}
                        </p>
                        <p className="text-sm ">
                            {getUserNameById(order.responsible)}
                        </p>
                        <p className="text-sm ">
                            {getUserNameById(order.dispatcher)}
                        </p>
                    </div>
                </div>
            ))}
            </div>
            <div className="lg:hidden p-4">
                {filteredOrders.filter(order => order.status === "pending").length > 0 ? (
                    filteredOrders.filter(order => order.status === "pending").map((order) => (
                        <div key={order.id} className="bg-white text-text-50 font-Manrope hover:bg-gray-100 p-3 rounded-lg shadow-md mt-4" onClick={() => navigate(`/order/${order.id}`)}>
                            <div className="grid">
                                <p className="text-sm text-text-100">Orden #{order.id}</p>
                                <p className="text-sm mt-3">
                                    {order.contractor}
                                </p>
                                <p className={`justify-self-end w-fit rounded-full px-2 py-1 ${order.status === "pending" ? "bg-gray-100 text-gray-500 " : "bg-green-100 text-green-400"}`}>
                                    {order.status}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                        <p>No hay ordenes pendientes</p>
                    </div>
                )}
            </div>
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
    )
};

export default Orders;