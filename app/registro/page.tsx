'use client'

import { useState } from 'react'

export default function Registro() {
  const [dni, setDni] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [estado, setEstado] = useState('abierto')

  return (
    <div style={{ padding: 20 }}>
      <h1>Registro Clínico</h1>

      <label>DNI</label>
      <input
        value={dni}
        onChange={(e) => setDni(e.target.value)}
      />

      <label>Nombres</label>
      <input
        value={nombres}
        onChange={(e) => setNombres(e.target.value)}
      />

      <label>Apellidos</label>
      <input
        value={apellidos}
        onChange={(e) => setApellidos(e.target.value)}
      />

      <label>Estado</label>
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="abierto">Abierto</option>
        <option value="cerrado">Cerrado</option>
      </select>

      <button>
        Guardar (luego lo conectamos a Supabase)
      </button>
    </div>
  )
}