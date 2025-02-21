import React, { useState, useEffect } from "react";
import "./card.css";
import { useProduct } from "../../hooks/useProduct";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { IoIosMore } from "react-icons/io";
export default function CardList({ item }) {
  const { deleteProduct } = useProduct();
  const navigate = useNavigate();
  const [img, setImg] = useState(null);

  const obtenerUrlImagen = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("files.img")
        .getPublicUrl(`img/${item.image_url}`);

      if (error) {
        console.error("Error al obtener la URL de la imagen:", error);
        return;
      }

      setImg(data.publicUrl);
    } catch (error) {
      console.error("Error al obtener la URL de la imagen:", error);
    }
  };

  useEffect(() => {
    obtenerUrlImagen();
  }, [item.image_url]);

  const onDelete = (item) => {
    deleteProduct(item.id);
    return navigate("/task-page");
  };
//https://Artistaje.supabase.co/storage/v1/object/public/files/img/
  return (
    <div className="imagen-port">
      <img src={`https://prwkiekcfinwcbbfbzqp.supabase.co/storage/v1/object/public/files/img/${item.image_url}`} alt={item.product_name} className="card-image" />
      <div className="hover-galeria">
          <img src="img/icono1.png" alt={item.name} />
        <p className="name">{item.product_name}</p>
        <div className="div-button">
          <button onClick={() => onDelete(item)}>Eliminar</button>
          <button>
            <Link className="link" to={`/add-task/${item.id}`}>
              Modificar
            </Link>
          </button>
          <button><IoIosMore /></button>
        </div>
      </div>
    </div>
  );
}
