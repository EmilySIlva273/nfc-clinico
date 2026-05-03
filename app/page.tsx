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
        const dni = decoder.decode(record.data).trim().replace("DNI:", "")

        const ahora = new Date()

        // 🟢 ENTRADA
        if (modo === 'entrada') {

          const { data } = await supabase
            .from('registros_clinicos')
            .select('*')
            .eq('dni', dni.trim())

          if (data && data.length > 0) {
            setPaciente({
              ...data[0],
              fecha_entrada: ahora.toLocaleDateString(),
              hora_entrada: ahora.toLocaleTimeString()
            })

            setModo('atencion')
            alert("Paciente cargado")
          } else {
            alert("Paciente no registrado")
          }
        }

        // 🔴 SALIDA (GUARDAR)
        else if (modo === 'atencion') {

          await supabase
            .from('registros_clinicos')
            .update({
              ...paciente,
              ...form,
              fecha_salida: ahora.toLocaleDateString(),
              hora_salida: ahora.toLocaleTimeString()
            })
            .eq('dni', paciente.dni)

          alert("Registro guardado ✔")
          setModo('entrada')

          setPaciente({
            dni: '',
            nombres: '',
            apellidos: '',
            sexo: '',
            fecha_nacimiento: '',
            edad: ''
          })
        }
      }
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

      {/* AUTO COMPLETADO */}
      <h3>Paciente</h3>

      <input value={paciente.dni} placeholder="DNI" />
      <input value={paciente.nombres} placeholder="Nombres" />
      <input value={paciente.apellidos} placeholder="Apellidos" />
      <input value={paciente.sexo} placeholder="Sexo" />
      <input value={paciente.fecha_nacimiento} placeholder="Fecha Nacimiento" />
      <input value={paciente.edad} placeholder="Edad" />

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
        <option>I</option>
        <option>II</option>
        <option>III</option>
        <option>IV</option>
      </select>

      <select name="farmacia" onChange={handleChange}>
        <option value="despacho">Despacho</option>
        <option value="prestamo">Préstamo</option>
      </select>
    </div>
  )
}
