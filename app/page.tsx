'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [modo, setModo] = useState<'entrada' | 'atencion'>('entrada')

  const [paciente, setPaciente] = useState<any>({
    dni: '',
    nombres: '',
    apellidos: '',
    sexo: '',
    fecha_nacimiento: '',
    edad: '',
    fecha_entrada: '',
    hora_entrada: ''
  })

  const [form, setForm] = useState<any>({
    signos_vitales: false,
    pregunta1: false,
    pregunta2: false,
    pregunta3: false,
    pregunta4: false,
    visip: '',
    f_box: '',
    observaciones: '',
    prioridad: 'I',
    farmacia: 'despacho'
  })

  // 📲 NFC
  const scanNFC = async () => {
    try {
      if (!('NDEFReader' in window)) {
        alert("NFC no soportado")
        return
      }

      const ndef = new (window as any).NDEFReader()
      await ndef.scan()

      alert("Acerca el NFC")

      ndef.onreading = async (event: any) => {
        const decoder = new TextDecoder()

        for (const record of event.message.records) {

          const dni = decoder
            .decode(record.data)
            .trim()
            .replace("DNI:", "")
            .replace(/\s/g, "")

          const ahora = new Date()

          console.log("DNI LEÍDO:", dni)

          // 🟢 ENTRADA (CARGAR PACIENTE)
          if (modo === 'entrada') {

            const { data, error } = await supabase
              .from('registros')
              .select('*')
              .eq('dni', dni)

            if (error) {
              console.log(error)
              alert("Error consultando paciente")
              return
            }

            if (data && data.length > 0) {

              const p = data[0]

              setPaciente({
                dni: p.dni,
                nombres: p.nombres,
                apellidos: p.apellidos,
                sexo: p.sexo,
                fecha_nacimiento: p.fecha_nacimiento, // ✔ automático desde Supabase
                edad: p.edad,
                fecha_entrada: ahora.toLocaleDateString(),
                hora_entrada: ahora.toLocaleTimeString()
              })

              setModo('atencion')
              alert("Paciente cargado ✔")

            } else {
              alert("Paciente no registrado")
            }
          }

          // 🔴 GUARDAR NUEVO REGISTRO (HISTORIAL)
          else if (modo === 'atencion') {

            const { error } = await supabase
              .from('registros')
              .insert([
                {
                  dni: paciente.dni,
                  nombres: paciente.nombres,
                  apellidos: paciente.apellidos,
                  sexo: paciente.sexo,
                  fecha_nacimiento: paciente.fecha_nacimiento,
                  edad: paciente.edad,

                  fecha_entrada: paciente.fecha_entrada,
                  hora_entrada: paciente.hora_entrada,

                  fecha_salida: ahora.toLocaleDateString(),
                  hora_salida: ahora.toLocaleTimeString(),

                  signos_vitales: form.signos_vitales,
                  pregunta1: form.pregunta1,
                  pregunta2: form.pregunta2,
                  pregunta3: form.pregunta3,
                  pregunta4: form.pregunta4,

                  visip: form.visip,
                  f_box: form.f_box,
                  observaciones: form.observaciones,

                  prioridad: form.prioridad,
                  farmacia: form.farmacia
                }
              ])

            if (error) {
              console.log("ERROR INSERT:", error)
              alert("Error al guardar registro")
              return
            }

            alert("Registro guardado ✔ (nuevo historial)")

            setModo('entrada')

            setPaciente({
              dni: '',
              nombres: '',
              apellidos: '',
              sexo: '',
              fecha_nacimiento: '',
              edad: '',
              fecha_entrada: '',
              hora_entrada: ''
            })
          }
        }
      }

    } catch (err) {
      console.log(err)
      alert("Error NFC")
    }
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCheck = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.checked })
  }

  return (
  <div className="min-h-screen bg-gray-100 p-6">

    {/* HEADER */}
    <div className="bg-white shadow p-4 rounded-xl mb-6">
      <h1 className="text-2xl font-bold text-center">
        🏥 Sistema Clínico NFC
      </h1>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* 🧍 PACIENTE */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">👤 Paciente</h2>

        <input className="input" value={paciente.dni} placeholder="DNI" readOnly />
        <input className="input" value={paciente.nombres} placeholder="Nombres" readOnly />
        <input className="input" value={paciente.apellidos} placeholder="Apellidos" readOnly />
        <input className="input" value={paciente.sexo} placeholder="Sexo" readOnly />
        <input className="input" value={paciente.fecha_nacimiento} placeholder="Fecha Nacimiento" readOnly />
        <input className="input" value={paciente.edad} placeholder="Edad" readOnly />
      </div>

      {/* 📋 FORMULARIO */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">📋 Registro Clínico</h2>

        <div className="space-y-2">

          <label><input type="checkbox" name="signos_vitales" onChange={handleCheck} /> Signos vitales</label>
          <label><input type="checkbox" name="pregunta1" onChange={handleCheck} /> Pregunta 1</label>
          <label><input type="checkbox" name="pregunta2" onChange={handleCheck} /> Pregunta 2</label>
          <label><input type="checkbox" name="pregunta3" onChange={handleCheck} /> Pregunta 3</label>
          <label><input type="checkbox" name="pregunta4" onChange={handleCheck} /> Pregunta 4</label>

          <input className="input" name="visip" placeholder="Resultado VISIP" onChange={handleChange} />
          <input className="input" name="f_box" placeholder="F. Box" onChange={handleChange} />
          <input className="input" name="observaciones" placeholder="Observaciones" onChange={handleChange} />

          <select className="input" name="prioridad" onChange={handleChange}>
            <option>I</option>
            <option>II</option>
            <option>III</option>
            <option>IV</option>
          </select>

          <select className="input" name="farmacia" onChange={handleChange}>
            <option value="despacho">Despacho</option>
            <option value="prestamo">Préstamo</option>
          </select>

        </div>
      </div>
    </div>

    {/* BOTONES NFC */}
    <div className="mt-6 flex gap-4 justify-center">

      <button
        onClick={scanNFC}
        className="bg-green-600 text-white px-6 py-3 rounded-xl shadow"
      >
        Escanear NFC
      </button>

    </div>

  </div>
)
}
