"use client";

import { useState } from "react";

export default function Home() {
  const [mensaje, setMensaje] = useState("Presiona el botón para activar NFC");

  const leerNFC = async () => {
    try {
      if ("NDEFReader" in window) {
        const ndef = new (window as any).NDEFReader();

        await ndef.scan();

        setMensaje("📡 Esperando NFC...");

        ndef.onreading = (event: any) => {
          const id = event.serialNumber || "SIN_ID";

          setMensaje("✅ NFC detectado: " + id);

          // Redirige al formulario
          window.location.href = `/registro?id=${id}`;
        };
      } else {
        alert("Tu celular no soporta NFC");
      }
    } catch (error) {
      console.error(error);
      alert("Error al activar NFC");
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>📲 Lector NFC</h1>

      <button onClick={leerNFC} style={{ padding: 10 }}>
        Activar NFC
      </button>

      <p>{mensaje}</p>
    </main>
  );
}