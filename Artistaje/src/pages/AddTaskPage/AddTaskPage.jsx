import React, { useState, useEffect } from "react";
import "./task.css";
import { supabase } from "../../supabaseClient";
import { useProduct } from "../../hooks/useProduct";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

export default function AddTaskPage() {
  const {
    error,
    loading,
    createProduct,
    updateProduct,
    getProductById,
    setSelectedImage,
    selectedImage,
    files,setFiles
  } = useProduct();
  const navigate = useNavigate();
  const args = useParams();
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (args.id) {
        const product = await getProductById(args.id);
        if (product) {
          setFormData({
            product_name: product.product_name,
            price: product.price.toString(),
            description: product.description,
          });
        }
      }
    };
    loadProduct();
  }, [args.id]);

  const STORAGE_BUCKET = "files";
  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    
    setFiles(file);
    console.log(files);

    if (!file) return;

    // Verificar tipo de archivo permitido
    const allowedTypes = ["image/jpg","image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Solo se aceptan archivos JPEG, PNG o GIF");
      return;
    }

    // Crear FileReader y configurarlo
    const reader = new FileReader();

    // Manejar errores durante la lectura
    reader.onerror = () => {
      toast.error("Error al leer el archivo");
    };

    // Manejar cuando se completa la lectura
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;

      // Validar que el resultado es una URL válida
      if (typeof imageDataUrl !== "string") {
        toast.error("Error al procesar la imagen");
        return;
      }

      setSelectedImage(imageDataUrl);
    };

    // Leer el archivo como URL de datos
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const productData = {
        product_name: formData.get("product_name"),
        price: parseFloat(formData.get("price")),
        description: formData.get("description"),
        imageFile: files.name
      };
      console.log(productData);

      if (args.id) {
        // Modificar producto existente
        await updateProduct(args.id, productData);
      } else {
        // Crear nuevo producto
        await createProduct(event);
      

        // Subir la imagen y obtener la URL
        const { data: storageData, error: uploadError } = await supabase.storage
          .from("files")
          .upload("img/" + files.name, files);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData, error: urlError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl("img/" + files.name);

        if (urlError) {
          throw urlError;
        }

      }
      navigate("/task-page");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="tulo">
          {args.id ? "Editar Producto" : "Agrega un producto"}
        </h2>
        <label className="name-input">
          <span>Nombre de producto</span>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={(e) =>
              setFormData({ ...formData, product_name: e.target.value })
            }
            placeholder="Nombre del Producto"
          />
        </label>
        <label className="name-input">
          <span>Precio de producto</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            min="0"
            placeholder="Precio"
          />
        </label>
        <label className="name-input">
          <span>Descripción</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Escribe algo"
          />
        </label>
        <label className="img-container">
          <span>Imagen de producto</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            name="image_url"
            className="w-[90%] rounded border h-10 text-sm"
          />
        </label>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Imagen seleccionada"
            className="img-preview"
          />
        ) : (
          <div className="placeholder">
            <p className="text-gray-400">Seleccione una imagen</p>
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : args.id ? "Actualizar" : "Guardar"}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
}
