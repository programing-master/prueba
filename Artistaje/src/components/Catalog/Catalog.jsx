import React from "react";
import "./catalog.css";
import CardList from "../CardList/CardList";
import { useProduct } from "../../hooks/useProduct";
export default function Catalog() {
  const {products}=useProduct()
  console.log(products)
  return (
    <>
      <section className="portafolio">
        <div className="contenedor">
          <h2 className="tulo">Nuestras ofertas</h2>
          <ul className="galeria-port">
            {products.map((item, index) => (
                <CardList key={index} item={item} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
