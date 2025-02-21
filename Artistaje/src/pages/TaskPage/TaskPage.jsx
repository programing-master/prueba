import React, { useEffect } from "react";
import "./task.css";
import Catalog from "../../components/Catalog/Catalog";
import { useProduct } from "../../hooks/useProduct";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//$2y$04$kq57yxWVveBjQuKO0ZlbuO7N.vtWxEKjlKdIMvySXnc9Mx9kT46a
export default function TaskPage() {
  const { getProducts, products } = useProduct();
  useEffect(() => {
    if (products) {
      getProducts();
    }
  }, [products]);
  return (
    <div className="container">
            <ToastContainer />

      <Catalog />
    </div>
  );
}
