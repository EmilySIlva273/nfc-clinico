'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [paciente, setPaciente] = useState<any>(null)

  const scanNFC = async () => {
    try {
      const ndef = new NDEFReader()
      await ndef.scan()

      alert("Escanea tu NFC")

      ndef.onreading = async (event) => {
        const decoder = new TextDecoder()

        for (const record of event.message.records) {
          if (record.recordType === "text") {

            const dni = decoder.decode(record.data).trim()

            console.log("DNI leído:", dni)

            // 🔥 Buscar en Supabase
            const { data, error } = await supabase
              .from('registros')
              .select('*')
              .eq('dni', dni)
              .single()

            if (data) {
              setPaciente(data)

              if (data.estado === "abierto") {
                alert("Paciente ya tiene registro abierto")
              } else {
                alert("Nuevo registro iniciado")
              }

            } else {
              alert("Paciente no registrado")
            }
          }
        }
      }

    } catch (error) {
      console.error(error)
      alert("Error al leer NFC")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Lector NFC</h1>

      <button onClick={scanNFC}>
        Activar NFC
      </button>

      {paciente && (
        <div>
          <h2>Datos del paciente</h2>
          <p>DNI: {paciente.dni}</p>
          <p>Nombre: {paciente.nombres}</p>
          <p>Apellido: {paciente.apellidos}</p>
          <p>Estado: {paciente.estado}</p>
        </div>
      )}
    </div>
  )
}