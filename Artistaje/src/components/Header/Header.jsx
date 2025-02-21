import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/task-page" className="link">
          Administrar
        </Link>
      </nav>
      <section className="textos-header">
        <h1>
          Artistaje <span className="sub-texto">Tiendas</span>
        </h1>
        <h6>Más cerca de ti</h6>
      </section>
      <div
        className="wave"
        style={{
          height: "150px",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          style={{ height: "100%", width: "100%" }}
        >
          <path
            d="M0.00,49.98 C150.00,150.00 349.20,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
            style={{ stroke: "none", fill: "#fff" }}
          ></path>
        </svg>
      </div>
    </header>
  );
}
