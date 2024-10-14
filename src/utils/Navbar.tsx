import { useNavigate } from "react-router-dom";
import userStore from "./ZustandStore";



const Navbar = () => {
  const navigate = useNavigate();

  const isAdmin = userStore((state) =>
    state.isAdmin,
  );
  


  return (

    <nav className="bg-primary-50 fixed lg:fixed lg:left-0 bottom-0 p-3 w-full lg:top-0 lg:h-[100vh] lg:w-fit text-xl ssm:p-5 2xl:p-6 text-text-100 font-Manrope shadow">
      <ul className="relative flex justify-around lg:grid ">
          <img className="w-full lg:block lg:absolute hidden" src="/logo SGB.svg" alt="logo"/>
        {isAdmin === true && (
          <div className="relative flex justify-around lg:grid w-full lg:mt-20">
            <span className="text-xs lg:block hidden">Vistas</span>
            <button onClick={() => navigate('/orders')} className="no-underline grid lg:flex lg:space-x-3 justify-items-center text-sm ssm:text-lg lg:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[icon-park-outline--transaction-order]"></span>
              Ordenes
            </button>
            <button onClick={() => navigate('/stock')} className="no-underline grid lg:flex lg:space-x-3 justify-items-center p-1 text-sm ssm:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[solar--box-linear]"></span>
              Stock
            </button>
            <button onClick={() => navigate('/users')} className="no-underline grid lg:flex lg:mb-5 lg:space-x-3 justify-items-center p-1 text-sm ssm:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[solar--users-group-rounded-line-duotone]"></span>
              Usuarios
            </button>
            <span className="text-xs lg:block hidden">Acciones rapidas</span>
            <button className="lg:flex items-center hidden bg-secondary-50 text-primary-50 rounded-lg p-2 text-lg my-3" onClick={()=> navigate("/newOrder")}>
            <span className="icon-[icons8--plus] text-xl mx-1 "></span>Nueva Orden</button>
            <button className="lg:flex items-center hidden bg-secondary-50 text-primary-50 rounded-lg p-2 text-lg" onClick={()=> navigate("/newProduct")}>
            <span className="icon-[icons8--plus] text-xl mx-1 "></span>Nuevo Producto</button>
          </div>
        )}
        {isAdmin === false && (
          <div className="mt-20 relative flex justify-around lg:grid w-full">
            <button onClick={() => navigate('/stock')} className="no-underline grid lg:flex lg:space-x-3 justify-items-center text-sm ssm:text-lg lg:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[solar--box-linear]"></span>
              Stock
            </button>
            <button onClick={() => navigate('/dispatches')} className="no-underline grid lg:flex lg:space-x-3 justify-items-center p-1 text-sm ssm:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[hugeicons--truck-delivery]"></span>
              Despachos
            </button>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;