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
    hora_entrada: '',
    fecha_salida: '',
    hora_salida: ''
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

  // 🔥 NFC
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

          // 🟢 ENTRADA (BUSCAR PACIENTE)
          if (modo === 'entrada') {

            const { data, error } = await supabase
              .from('registros')
              .select('*')
              .eq('dni', dni)

            if (error) {
              console.log("ERROR SUPABASE:", error)
              alert("Error consultando base de datos")
              return
            }

            if (data && data.length > 0) {

              setPaciente({
                ...data[0],
                fecha_entrada: ahora.toLocaleDateString(),
                hora_entrada: ahora.toLocaleTimeString()
              })

              setModo('atencion')
              alert("Paciente cargado ✔")

            } else {
              alert("Paciente no registrado")
            }
          }

          // 🔴 SALIDA (GUARDAR TODO)
          else if (modo === 'atencion') {

            const { error } = await supabase
              .from('registros')
              .update({
                ...paciente,
                ...form,
                fecha_salida: ahora.toLocaleDateString(),
                hora_salida: ahora.toLocaleTimeString()
              })
              .eq('dni', paciente.dni)

            if (error) {
              console.log("ERROR AL GUARDAR:", error)
              alert("Error al guardar registro")
              return
            }

            alert("Registro guardado ✔")

            setModo('entrada')

            setPaciente({
              dni: '',
              nombres: '',
              apellidos: '',
              sexo: '',
              fecha_nacimiento: '',
              edad: '',
              fecha_entrada: '',
              hora_entrada: '',
              fecha_salida: '',
              hora_salida: ''
            })
          }
        }
      }

    } catch (err) {
      console.log(err)
      alert("Error NFC o permisos")
    }
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCheck = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.checked })
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Sistema Clínico NFC</h1>

      <button onClick={scanNFC}>
        {modo === 'entrada' ? 'Escanear Entrada' : 'Escanear Salida / Guardar'}
      </button>

      {/* PACIENTE */}
      <h3>Paciente</h3>

      <input value={paciente.dni} placeholder="DNI" readOnly />
      <input value={paciente.nombres} placeholder="Nombres" readOnly />
      <input value={paciente.apellidos} placeholder="Apellidos" readOnly />
      <input value={paciente.sexo} placeholder="Sexo" readOnly />
      <input value={paciente.fecha_nacimiento} placeholder="Fecha Nacimiento" readOnly />
      <input value={paciente.edad} placeholder="Edad" readOnly />

      <hr />

      {/* FORMULARIO MANUAL */}
      <h3>Registro Clínico</h3>

      <label>
        <input type="checkbox" name="signos_vitales" onChange={handleCheck} />
        Signos vitales
      </label>

      <label>
        <input type="checkbox" name="pregunta1" onChange={handleCheck} />
        Pregunta 1
      </label>

      <label>
        <input type="checkbox" name="pregunta2" onChange={handleCheck} />
        Pregunta 2
      </label>

      <label>
        <input type="checkbox" name="pregunta3" onChange={handleCheck} />
        Pregunta 3
      </label>

      <label>
        <input type="checkbox" name="pregunta4" onChange={handleCheck} />
        Pregunta 4
      </label>

      <br />

      <input name="visip" placeholder="Resultado VISIP" onChange={handleChange} />
      <input name="f_box" placeholder="F. Box" onChange={handleChange} />
      <input name="observaciones" placeholder="Observaciones" onChange={handleChange} />

      <br />

      <select name="prioridad" onChange={handleChange}>
        <option value="I">I</option>
        <option value="II">II</option>
        <option value="III">III</option>
        <option value="IV">IV</option>
      </select>

      <select name="farmacia" onChange={handleChange}>
        <option value="despacho">Despacho</option>
        <option value="prestamo">Préstamo</option>
      </select>
    </div>
  )
}
