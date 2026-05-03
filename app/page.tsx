'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [paciente, setPaciente] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const scanNFC = async () => {
    setLoading(true)

    try {
      // 🔥 Verifica soporte NFC
      if (typeof window === "undefined") return

      if (!('NDEFReader' in window)) {
        alert("Este dispositivo no soporta NFC")
        setLoading(false)
        return
      }

      const ndef = new (window as any).NDEFReader()

      await ndef.scan()

      alert("Acerca el NFC al teléfono")

      ndef.onreading = async (event: any) => {
        const decoder = new TextDecoder()

        for (const record of event.message.records) {
          if (record.recordType === "text") {

            const dni = decoder.decode(record.data).trim()

            alert("DNI LEÍDO: " + dni)

            // 🔥 BUSCAR EN SUPABASE
            const { data, error } = await supabase
              .from('registros')
              .select('*')
              .eq('dni', dni)
              .single()

            if (error || !data) {
              alert("Paciente no registrado")
              setPaciente(null)
            } else {
              setPaciente(data)
              alert("Paciente encontrado")
            }
          }
        }
      }

    } catch (error) {
      console.error(error)
      alert("Error al usar NFC o permisos denegados")
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Lector NFC Clínico</h1>

      {/* BOTÓN NFC */}
      <button
        type="button"
        onClick={scanNFC}
        disabled={loading}
        style={{
          padding: 10,
          background: loading ? 'gray' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        {loading ? "Escaneando..." : "Escanear NFC"}
      </button>

      {/* RESULTADO */}
      {paciente && (
        <div style={{ marginTop: 20 }}>
          <h2>Paciente encontrado</h2>
          <p><b>DNI:</b> {paciente.dni}</p>
          <p><b>Nombres:</b> {paciente.nombres}</p>
          <p><b>Apellidos:</b> {paciente.apellidos}</p>
          <p><b>Estado:</b> {paciente.estado}</p>
        </div>
      )}
    </div>
  )
}