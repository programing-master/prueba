import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
export const ProductContext = createContext();
import { toast } from "react-toastify";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
const [files,setFiles]=useState(null)
  // Crear nuevo producto
  const STORAGE_BUCKET = "files"; // El bucket donde se almacenarán las imágenes

  // Modificar createProduct
  const createProduct = async (event) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const productData = {
        product_name: formData.get("product_name"),
        price: parseFloat(formData.get("price")),
        description: formData.get("description"),
        imageFile: formData.get("image_url").files
         
      };
      console.log(productData);
      let imageUrl = null;
      if (productData.imageFile) {
        // Crear la carpeta si no existe
        const { error: folderError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .createFolder("1", { cascade: true });

        if (folderError) {
          console.warn("Carpeta ya existe o no se pudo crear");
        }

        // Subir la imagen y obtener la URL
        const { data: storageData, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload("1/" + productData.imageFile.name, productData.imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData, error: urlError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl("1/" + productData.imageFile.name);

        if (urlError) {
          throw urlError;
        }

        imageUrl = publicUrlData.publicUrl;
      }

      // Guardar en la base de datos con la URL
      const { data, error } = await supabase.from("products").insert([
        {
          product_name: productData.product_name,
          price: productData.price,
          description: productData.description,
          image_url: files.name,
          user_id: 1,
        },
      ]);

      if (error) {
        throw error;
      }

      event.target.reset();
      setSelectedImage(null);
      return toast.success("Se ha creado el producto!", {
        position: "bottom-right",
        autoClose: 5000,
        closeButton: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  // Obtener todos los productos
  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        return toast.error("Problemas de Carga!", {
          position: "bottom-right",
          autoClose: 5000,
          closeButton: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          draggable: true,
          progress: undefined,
        });
      }

      setProducts(data);
      return data;
    } catch (err) {
      setError(err.error_description || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar producto
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .update([
          {
            id: id,
            ...productData,
            user_id: 1,
          },
        ])
        .eq("id", id);
      if (error) {
        throw error;
      }

      // Actualizar el estado local
      const updatedProducts = products.map((product) =>
        product.id === id ? data[0] : product
      );
      setProducts(updatedProducts);
      return toast.success("Producto actualizado!", {
        position: "bottom-right",
        autoClose: 5000,
        closeButton: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      setError(err.error_description || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Primero obtener el producto para borrar su imagen
      const { data: productData, error: getProductError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (getProductError) {
        return toast.error("No se ha encontrado el producto a eliminar!", {
          position: "bottom-right",
          autoClose: 5000,
          closeButton: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          draggable: true,
          progress: undefined,
        });
        throw getProductError;
      }

      // Borrar la imagen del storage
      if (productData.image_url) {
        const imageName = productData.image_url.split("/").pop();
        await supabase.storage.from("products").remove([imageName]);
      }

      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        return toast.error("No se ha eliminado el producto!", {
          position: "bottom-right",
          autoClose: 5000,
          closeButton: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          draggable: true,
          progress: undefined,
        });
        throw error;
      }
      return toast.success("Se ha eliminado el producto!", {
        position: "bottom-right",
        autoClose: 5000,
        closeButton: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      setError(err.error_description || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw error;
      }
      return data;
    } catch (err) {
      setError(err.error_description || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        createProduct,
        getProducts,
        updateProduct,
        deleteProduct,
        getProductById,
        setSelectedImage,
        selectedImage,
        files,setFiles
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
