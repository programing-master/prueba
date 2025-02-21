import React from 'react'
import Header from '../../components/Header/Header'
import Catalog from '../../components/Catalog/Catalog'
import Footer from '../../components/Footer/Footer'
import "./home.css"
export default function Home() {
  return (
    <div className="home">
      <Header/>
      <Catalog/>
      <Footer/>
    </div>
  )
}
