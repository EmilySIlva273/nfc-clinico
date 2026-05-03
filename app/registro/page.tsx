"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Registro() {
  const params = useSearchParams();
  const id = params.get("id");

  const [fechaInicio, setFechaInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");

  const [form, setForm] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    sexo: "",
    nacimiento: "",
    edad: "",
    prioridad: "I",
    observaciones: "",
  });

  useEffect(() => {
    const ahora = new Date();
    setFechaInicio(ahora.toLocaleDateString());
    setHoraInicio(ahora.toLocaleTimeString());

    // 🔥 Simulación de datos (luego conectamos BD)
    if (id) {
      setForm({
        dni: "12345678",
        nombres: "Juan",
        apellidos: "Pérez",
        sexo: "M",
        nacimiento: "2000-01-01",
        edad: "25",
        prioridad: "I",
        observaciones: "",
      });
    }
  }, [id]);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = async () => {
    try {
      if ("NDEFReader" in window) {
        const ndef = new (window as any).NDEFReader();

        await ndef.scan();

        alert("📡 Acerque el mismo NFC para guardar");

        ndef.onreading = (event: any) => {
          const idCierre = event.serialNumber;

          if (idCierre !== id) {
            alert("❌ NFC diferente");
            return;
          }

          const ahora = new Date();

          const data = {
            id,
            ...form,
            fechaInicio,
            horaInicio,
            fechaFin: ahora.toLocaleDateString(),
            horaFin: ahora.toLocaleTimeString(),
          };

          console.log("GUARDADO:", data);

          alert("✅ Registro guardado correctamente");
        };
      }
    } catch (error) {
      alert("Error al guardar");
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h2>🩺 Registro Clínico</h2>

      <p><b>ID NFC:</b> {id}</p>
      <p><b>Fecha:</b> {fechaInicio}</p>
      <p><b>Hora:</b> {horaInicio}</p>

      <input name="dni" value={form.dni} onChange={handleChange} placeholder="DNI" /><br />
      <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" /><br />
      <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" /><br />
      <input name="sexo" value={form.sexo} onChange={handleChange} placeholder="Sexo" /><br />
      <input name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" /><br />

      <select name="prioridad" value={form.prioridad} onChange={handleChange}>
        <option>I</option>
        <option>II</option>
        <option>III</option>
        <option>IV</option>
      </select>

      <textarea name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones" />

      <br /><br />

      <button onClick={guardar}>
        💾 Guardar (volver a escanear NFC)
      </button>
    </main>
  );
}