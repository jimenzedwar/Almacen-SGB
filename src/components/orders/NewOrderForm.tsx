import { useState, useEffect, useMemo, useCallback } from "react";
import supabase from "../../utils/supabase";
import Swal from "sweetalert2";
import userStore from "../../utils/ZustandStore";
import { Dropdown } from "flowbite";

export interface Products {
  id: string;
  product_name: string;
  product_measurement: string;
  quantity: number;
  photo: string;
}

export interface OrderProduct extends Products {
  quantity: number;
}

export interface Order {
  contractor: string;
  responsible: string;
  products: OrderProduct[];
}

export interface FormErrors {
  contractor: string;
  responsible: string;
  products: string;
}

export const validateForm = (formData: Order): FormErrors => {
  const errors: FormErrors = {
    contractor: "",
    responsible: "",
    products: "",
  };

  // Validar contractor
  if (!formData.contractor) {
    errors.contractor = "El contratista es obligatorio.";
  }

  if (formData.products.length === 0) {
    errors.products = "Debes agregar al menos un producto.";
  } else {
    // Verificar si algún producto tiene cantidad 0
    const productWithZeroQuantity = formData.products.some(product => product.quantity === 0);
    if (productWithZeroQuantity) {
      errors.products = "Todos los productos deben tener una cantidad mayor a 0.";
    }
  }

  return errors;
};

const NewOrderForm = () => {
  const [newOrder, setNewOrder] = useState<Order>({
    contractor: "",
    responsible: "",
    products: [],
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    contractor: "",
    responsible: "",
    products: "",
  });

  const [searchText, setSearchText] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const products = userStore((state) => state.products);
  const activeUser = userStore((state) => state.activeUser);

  useEffect(() => {
    if (activeUser) {
      setNewOrder((prevOrder) => ({
        ...prevOrder,
        responsible: activeUser.sub,
      }));
    }
  }, [activeUser]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const updatedOrder = { ...newOrder, [name]: value };
    setNewOrder(updatedOrder);
    setFormErrors(validateForm(updatedOrder));
  }, [newOrder]);

  const handleProductChange = useCallback((productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product && quantity <= product.quantity) {
      const updatedProducts = newOrder.products.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      );
      const updatedOrder = { ...newOrder, products: updatedProducts };
      setNewOrder(updatedOrder);
      setFormErrors(validateForm(updatedOrder));
    }
  }, [newOrder, products]);

  const handleAddProduct = useCallback((productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      if (selectedProducts.has(productId)) {
        handleRemoveProduct(productId);
      } else {
        const updatedOrder = {
          ...newOrder,
          products: [...newOrder.products, { ...product, quantity: 0 }],
        };
        setNewOrder(updatedOrder);
        setSelectedProducts((prevSelected) => new Set(prevSelected).add(productId));
        setFormErrors(validateForm(updatedOrder));
      }
    }
  }, [newOrder, products, selectedProducts]);

  const handleRemoveProduct = useCallback((productId: string) => {
    const updatedProducts = newOrder.products.filter((product) => product.id !== productId);
    const updatedOrder = { ...newOrder, products: updatedProducts };
    setNewOrder(updatedOrder);
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.delete(productId);
      return newSelected;
    });
    setFormErrors(validateForm(updatedOrder));
  }, [newOrder]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(formErrors).every((error) => error === "")) {
      try {
        // Crear la orden
        const { data, error } = await supabase
          .from("orders")
          .insert([
            {
              contractor: newOrder.contractor,
              responsible: newOrder.responsible,
              products: newOrder.products,
            },
          ])
          .select();

        if (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        } else {
          // Actualizar cantidades de productos
          for (const orderProduct of newOrder.products) {
            const product = products.find((p) => p.id === orderProduct.id);
            if (product) {
              const newQuantity = product.quantity - orderProduct.quantity;
              const { error: updateError } = await supabase
                .from("products")
                .update({ quantity: newQuantity })
                .eq("id", product.id);

              if (updateError) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: `Error actualizando la cantidad de ${product.product_name}: ${updateError.message}`,
                });
                return;
              }
            }
          }

          Swal.fire({
            icon: "success",
            title: "Orden creada",
            text: "La orden ha sido creada exitosamente.",
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.product_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [products, searchText]);

  useEffect(() => {
    // Inicializar el dropdown cuando el componente se monta
    const $targetEl = document.getElementById('dropdownSearch');
    const $triggerEl = document.getElementById('dropdownSearchButton');

    if ($targetEl && $triggerEl) {
      const dropdown = new Dropdown($targetEl, $triggerEl, {
        placement: 'bottom',
        triggerType: 'click',
        offsetSkidding: 0,
        offsetDistance: 10,
        delay: 300,
        ignoreClickOutsideClass: false,
        onHide: () => {
          console.log('dropdown has been hidden');
        },
        onShow: () => {
          console.log('dropdown has been shown');
        },
        onToggle: () => {
          console.log('dropdown has been toggled');
        },
      });
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-3 h-full m-5 rounded-lg sm:grid sm:grid-cols-2 sm:justify-items-start">
        <div>
          <label htmlFor="contractor" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
            Contratista
          </label>
          <input
            type="text"
            id="contractor"
            className="bg-gray-50 border border-gray-300 text-text-50 text-sm rounded-lg focus:ring-secondary-50 focus:border-secondary-50 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-50 dark:focus:border-secondary-50"
            placeholder="Nombre del contratista"
            required
            name="contractor"
            value={newOrder.contractor}
            onChange={handleChange}
          />
          {formErrors.contractor && <p className="text-red-500 text-xs">{formErrors.contractor}</p>}
        </div>
      
        <div className="mb-6">
          <label htmlFor="dropdownSearchButton" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
            Buscar Productos
          </label>
          <button
            id="dropdownSearchButton"
            data-dropdown-toggle="dropdownSearch"
            data-dropdown-placement="bottom"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            Productos
            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          <div id="dropdownSearch" className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
            <div className="p-3">
              <label htmlFor="input-group-search" className="sr-only">
                Buscar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="input-group-search"
                  className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Buscar productos"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
            <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id={`checkbox-item-${product.id}`}
                      type="checkbox"
                      value={product.id}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleAddProduct(product.id)}
                    />
                    <label htmlFor={`checkbox-item-${product.id}`} className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                      {product.product_name}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mb-6 col-span-2 w-full">
          <label htmlFor="products" className="block mb-2 text-sm font-medium text-text-50 dark:text-white">
            Productos Seleccionados
          </label>
          <ul>
            {newOrder.products.map((orderProduct) => {
              const product = products.find((p) => p.id === orderProduct.id);
              return (
                <li key={orderProduct.id} className="flex justify-between items-center p-2 border-b border-gray-300 w-full">
                  <span>{product?.product_name}</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="p-2 rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white"
                      onClick={() => handleProductChange(orderProduct.id, orderProduct.quantity - 1)}
                      disabled={orderProduct.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-2">{orderProduct.quantity}</span>
                    <button
                      type="button"
                      className="p-2 rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed bg-secondary-100 text-secondary-50 hover:bg-secondary-50 hover:text-white"
                      onClick={() => handleProductChange(orderProduct.id, orderProduct.quantity + 1)}
                      disabled={product && orderProduct.quantity >= product.quantity}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="bg-red-200 text-red-500 flex justify-items-center p-2 rounded ml-2 "
                      onClick={() => handleRemoveProduct(orderProduct.id)}
                    >
                      <span className="icon-[solar--trash-bin-2-linear]"></span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {formErrors.products && <p className="text-red-500 text-xs">{formErrors.products}</p>}
        </div>
        <button
          type="submit"
          className="disabled:cursor-not-allowed disabled:bg-secondary-100 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          disabled={!Object.values(formErrors).every((error) => error === "") || !Object.values(newOrder).every((value) => value)}
        >
          Crear Orden
        </button>
      </form>
    </div>
  );
};

export default NewOrderForm;