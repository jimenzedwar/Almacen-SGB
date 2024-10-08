import { useState } from "react";
import supabase from "./supabase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import userStore from "./ZustandStore";

interface LoginData {
  email: string;
  password: string;
}

interface LoginErrors {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();


  const fetchProducts = userStore((state) =>
    state.fetchProducts,
);
  const fetchUsers = userStore((state) =>
    state.fetchUsers,
);
  const fetchOrders = userStore((state) =>
    state.fetchOrders,
);
  const fetchAdmin = userStore((state) =>
    state.fetchAdmin,
);
  const setActiveUser = userStore((state) =>
    state.setActiveUser,
);

  const [logUser, setLogUser] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState<LoginErrors>({
    email: "",
    password: "",
  });

  const validateForm = (formData: LoginData): LoginErrors => {
    const errors: LoginErrors = {
      email: "",
      password: "",
    };

    // Validar email
    if (!formData.email) {
      errors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El correo electrónico no es válido.";
    }

    // Validar password
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    return errors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const updatedUser = { ...logUser, [name]: value };
    setLogUser(updatedUser);
    setLoginErrors(validateForm(updatedUser));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(loginErrors).every((error) => error === "")) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: logUser.email,
          password: logUser.password,
        });

        if (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Bienvenido",
            text: "Inicio de sesión exitoso",
          });

          if (data) {
            const activeUser = {
              sub: data.user.id,
              role: data.user.user_metadata.role,
              email: data.user.email,
              full_name: data.user.user_metadata.full_name,
              identification: data.user.user_metadata.identification,
            };
            setActiveUser(activeUser);
          }
          if (data?.user.user_metadata?.role === 'admin') {
            fetchAdmin();
            fetchOrders();
            fetchProducts();
            fetchUsers();
            navigate('/orders');
          } else {
            fetchProducts();
            fetchOrders();
            navigate('/stock');
          }
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salió mal. Por favor, inténtalo de nuevo.",
        });
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 font-Manrope w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex justify-center mb-6">
          <img className="w-[80%]" src="/logo SGB.svg" alt="logo" />
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-semibold leading-tight tracking-tight text-text-50 md:text-2xl dark:text-white">
              Accede a tu cuenta
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
                  Correo
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={logUser.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-text-50 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="nombre@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  value={logUser.password}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-text-50 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="disabled:cursor-not-allowed disabled:bg-secondary-100 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;