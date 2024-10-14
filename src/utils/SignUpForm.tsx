import { useState, useCallback } from "react";
import supabase from "./supabase";
import Swal from "sweetalert2";

interface FormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  identification: string;
  role: string;
}

interface FormErrors {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  identification: string;
  role: string;
}

const SignUpForm = () => {
  const [user, setUser] = useState<FormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    identification: "",
    role: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    identification: "",
    role: "",
  });

  const validateForm = useCallback((formData: FormData): FormErrors => {
    const errors: FormErrors = {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      identification: "",
      role: "",
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

    // Validar first_name
    if (!formData.first_name) {
      errors.first_name = "El nombre es obligatorio.";
    }

    // Validar last_name
    if (!formData.last_name) {
      errors.last_name = "El apellido es obligatorio.";
    }

    // Validar identification
    if (!formData.identification) {
      errors.identification = "La identificación es obligatoria.";
    }

    // Validar role
    if (!formData.role) {
      errors.role = "El rol es obligatorio.";
    }

    return errors;
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const updatedUser = { ...user, [name]: value };
    setUser(updatedUser);
    setFormErrors(validateForm(updatedUser));
  }, [user, validateForm]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(formErrors).every((error) => error === "")) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              full_name: `${user.first_name} ${user.last_name}`,
              identification: user.identification,
              role: user.role,
            },
          },
        });

        if (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        } else {
          const userId = data.user?.id;

          if (userId) {
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: userId,
                  full_name: `${user.first_name} ${user.last_name}`,
                  identification: user.identification,
                  role: user.role,
                },
              ]);

            if (insertError) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: insertError.message,
              });
            } else {
              Swal.fire({
                icon: "success",
                title: "Usuario creado",
                text: "El usuario ha sido creado exitosamente.",
              });
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No se pudo obtener el UUID del usuario.",
            });
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
  }, [formErrors, user]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-3 lg:p-5 m-5 mb-20 rounded-lg">
        <div className="grid gap-6 mb-6 md:grid-cols-2 ">
          <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
              Nombre
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
              placeholder="John"
              required
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
            />
            {formErrors.first_name && <p className="text-red-500 text-xs">{formErrors.first_name}</p>}
          </div>
          <div>
            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
              Apellido
            </label>
            <input
              type="text"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
              placeholder="Doe"
              required
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
            />
            {formErrors.last_name && <p className="text-red-500 text-xs">{formErrors.last_name}</p>}
          </div>
          <div>
            <label htmlFor="identification" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
              Identificación
            </label>
            <input
              type="text"
              id="identification"
              className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
              placeholder="12345678"
              required
              name="identification"
              value={user.identification}
              onChange={handleChange}
            />
            {formErrors.identification && <p className="text-red-500 text-xs">{formErrors.identification}</p>}
          </div>
          <div>
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
              Selecciona un rol
            </label>
            <select
              id="role"
              className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
              name="role"
              value={user.role}
              onChange={handleChange}
            >
              <option value="">Rol</option>
              <option value="user">Despachador</option>
              <option value="admin">Administrador</option>
            </select>
            {formErrors.role && <p className="text-red-500 text-xs">{formErrors.role}</p>}
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
            Correo
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
            placeholder="john.doe@company.com"
            required
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
            placeholder="•••••••••"
            required
            name="password"
            value={user.password}
            onChange={handleChange}
          />
          {formErrors.password && <p className="text-red-500 text-xs">{formErrors.password}</p>}
        </div>

        <button
          type="submit"
          className="disabled:cursor-not-allowed disabled:bg-secondary-100 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={!Object.values(formErrors).every((error) => error === "") || !Object.values(user).every((value) => value)}
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;