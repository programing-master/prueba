import React from "react";
import "./footer.css"
export default function Footer() {
  return (
    <footer>
      <div className="contenedor-footer">
        <div className="content-foo">
          <h4>Phone</h4>
          <p>+53 56127644</p>
        </div>
        <div className="content-foo">
          <h4>Email</h4>
          <p>valladalonsoja@gmail.com</p>
        </div>
        <div className="content-foo">
          <h4>Location</h4>
          <p>
            Cuba-Pinar del Río-Reparto Hermanos Cruz ,Avenida Borrego, Edificio
            24
          </p>
        </div>
      </div>
      <h2 className="titulo-final">
        &copy; Javier Design | Javier Ernesto Valladares Alonso
      </h2>
    </footer>
  );
}
