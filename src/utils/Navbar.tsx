import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "./supabase"; // Asegúrate de importar tu instancia de Supabase

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

  //todo eliminar esta funcion y hacer que el rol se guarde en el estado global
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users') // Cambia 'Users' por el nombre de tu tabla de usuarios
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
        } else {
          setRole(data.role);
        }
      }
    };

    fetchUserRole();
  }, []);

  return (
    //todo agregar botones de acciones rapidas y hacer que ocupe espacio real en la pantalla
    <nav className="bg-primary-50 fixed bottom-0 p-3 w-full lg:top-0 lg:h-full lg:w-fit text-xl ssm:p-5 2xl:p-6 text-text-100 font-Manrope shadow">
      <ul className="relative flex justify-around lg:grid ">
        {role === 'admin' && (
          <>
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
          </>
        )}
        {role === "user" && (
          <>
            <button onClick={() => navigate('/orders')} className="no-underline grid lg:flex lg:space-x-3 justify-items-center text-sm ssm:text-lg lg:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[icon-park-outline--transaction-order]"></span>
              Ordenes
            </button>
            <button onClick={() => navigate('/dispatches')} className="no-underline grid lg:flex lg:space-x-3 justify-items-center p-1 text-sm ssm:text-xl lg:hover:bg-secondary-100 rounded-xl py-1 lg:px-5 hover:cursor-pointer hover:text-secondary-50">
              <span className="top-0.5 lg:text-xl ssm:text-2xl relative icon-[hugeicons--truck-delivery]"></span>
              Despachos
            </button>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;