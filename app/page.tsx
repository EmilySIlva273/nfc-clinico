'use client'

import { useState } from 'react'

export default function Home() {
  const [dni, setDni] = useState('')
  const [paciente, setPaciente] = useState<any>(null)

  return (
    <div style={{ padding: 20 }}>
      <h1>Lector NFC</h1>

      <button>
        Activar NFC
      </button>

      {paciente && (
        <div>
          <h2>Paciente</h2>
          <p>DNI: {paciente.dni}</p>
          <p>Nombres: {paciente.nombres}</p>
        </div>
      )}
    </div>
  )
}