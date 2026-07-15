import React from 'react'
import './Loading.css'

function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Buscando informações do artista...</p>
    </div>
  )
}

export default Loading