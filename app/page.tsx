'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [paciente, setPaciente] = useState<any>(null)

  const scanNFC = async () => {
    if (typeof window === "undefined") return

    try {
      const ndef = new (window as any).NDEFReader()

      await ndef.scan()

      alert("Escanea tu NFC")

      ndef.onreading = async (event: any) => {
        const decoder = new TextDecoder()

        for (const record of event.message.records) {
          if (record.recordType === "text") {

            const dni = decoder.decode(record.data).trim()

            console.log("DNI leído:", dni)

            const { data, error } = await supabase
              .from('registros')
              .select('*')
              .eq('dni', dni.trim())
              .single()
          }
        }
      }

    } catch (error) {
      console.error("Error NFC:", error)
      alert("NFC no disponible")
    }
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