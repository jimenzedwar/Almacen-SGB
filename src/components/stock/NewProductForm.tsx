import { useState } from "react";
import supabase from "../../utils/supabase";
import Swal from "sweetalert2";

export interface Products {
  id: number;
  product_name: string;
  product_measurement: string;
  quantity: number;
  photo: string;
}

export interface FormErrors {
  product_name: string;
  product_measurement: string;
  quantity: string;
  photo: string;
}

export const validateForm = (formData: Products, file: File | null): FormErrors => {
  const errors: FormErrors = {
    product_name: "",
    product_measurement: "",
    quantity: "",
    photo: "",
  };

  if (!formData.product_name) {
    errors.product_name = "El nombre del producto es requerido.";
  }
  if (!formData.product_measurement) {
    errors.product_measurement = "La medida del producto es requerida.";
  }
  if (!formData.quantity) {
    errors.quantity = "La cantidad del producto es requerida.";
  }
  if (!formData.photo && !file) {
    errors.photo = "La foto del producto es requerida.";
  }

  return errors;
};

const NewProductForm = () => {
  const [newProduct, setNewProduct] = useState<Products>({
    id: 0,
    product_name: "",
    product_measurement: "",
    quantity: 0,
    photo: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    product_name: "",
    product_measurement: "",
    quantity: "",
    photo: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const updatedProduct = { ...newProduct, [name]: value };
    setNewProduct(updatedProduct);
    setFormErrors(validateForm(updatedProduct, file));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFormErrors(validateForm(newProduct, event.target.files[0]));
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const filePath = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('products_photos')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('products_photos')
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      console.error('Error getting public URL');
      return null;
    }

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(formErrors).every((error) => error === "")) {
      try {
        let photoUrl = newProduct.photo;

        if (file) {
          const uploadedUrl = await uploadFile(file);
          if (uploadedUrl) {
            photoUrl = uploadedUrl;
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error uploading file. Please try again.",
            });
            return;
          }
        }
        console.log(photoUrl);

        const { data, error } = await supabase
          .from("products")
          .insert([
            {
              product_name: newProduct.product_name,
              product_measurement: newProduct.product_measurement,
              quantity: newProduct.quantity,
              photo: photoUrl,
            }
          ])
          .select();

        if (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Producto creado",
            text: "El producto ha sido creado exitosamente.",
          });
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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label htmlFor="product_name" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
            Nombre del Producto
          </label>
          <input
            type="text"
            id="product_name"
            className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
            placeholder="Nombre del producto"
            required
            name="product_name"
            value={newProduct.product_name}
            onChange={handleChange}
          />
          {formErrors.product_name && <p className="text-red-500 text-xs">{formErrors.product_name}</p>}
        </div>
        <div>
          <label htmlFor="product_measurement" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
            Medida del Producto
          </label>
          <input
            type="text"
            id="product_measurement"
            className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
            placeholder="Medida del producto"
            required
            name="product_measurement"
            value={newProduct.product_measurement}
            onChange={handleChange}
          />
          {formErrors.product_measurement && <p className="text-red-500 text-xs">{formErrors.product_measurement}</p>}
        </div>
      </div>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
            placeholder="Cantidad"
            required
            name="quantity"
            value={newProduct.quantity}
            onChange={handleChange}
          />
          {formErrors.quantity && <p className="text-red-500 text-xs">{formErrors.quantity}</p>}
        </div>
        <div>
          <label htmlFor="photo" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
            Foto del Producto
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            onChange={handleFileChange}
          />
          {formErrors.photo && <p className="text-red-500 text-xs">{formErrors.photo}</p>}
        </div>
      </div>
      <button
        type="submit"
        className="disabled:cursor-not-allowed disabled:bg-secondary-100 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        disabled={!Object.values(formErrors).every((error) => error === "")}
      >
        Crear Producto
      </button>
    </form>
  );
};

export default NewProductForm;