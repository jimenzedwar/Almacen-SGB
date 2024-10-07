import { useNavigate } from "react-router-dom";
import userStore from "./ZustandStore";



const Navbar = () => {
  const navigate = useNavigate();

  const isAdmin = userStore((state) =>
    state.isAdmin,
  );
  

  console.log(isAdmin);


  return (

    //todo agregar botones de acciones rapidas
    <nav className="bg-primary-50 fixed lg:relative bottom-0 p-3 w-full lg:top-0 lg:h-[100vh] lg:w-fit text-xl ssm:p-5 2xl:p-6 text-text-100 font-Manrope shadow">
      <ul className="relative flex justify-around lg:grid ">
          <img className="w-full lg:block lg:absolute hidden" src="/logo SGB.svg" alt="logo"/>
        {isAdmin === true && (
          <div className="relative flex justify-around lg:grid w-full mt-20">
            <button onClick={() => navigate('/orders')} className="no-underline grid lg:flex lg:space-x-3 justify-items-center text-sm ssm:text-lg lg:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[icon-park-outline--transaction-order]"></span>
              Ordenes
            </button>
            <button onClick={() => navigate('/stock')} className="no-underline grid lg:flex lg:space-x-3 justify-items-center p-1 text-sm ssm:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[solar--box-linear]"></span>
              Stock
            </button>
            <button onClick={() => navigate('/users')} className="no-underline grid lg:flex lg:space-x-3 justify-items-center p-1 text-sm ssm:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[solar--users-group-rounded-line-duotone]"></span>
              Usuarios
            </button>
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