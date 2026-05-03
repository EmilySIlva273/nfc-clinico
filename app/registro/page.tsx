"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mensaje, setMensaje] = useState("Iniciando NFC...");
  const router = useRouter();

  useEffect(() => {
    iniciarNFC();
  }, []);

  const iniciarNFC = async () => {
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      setMensaje("Esperando NFC...");

      ndef.onreading = (event: any) => {
        const id = event.serialNumber;

        alert("NFC detectado: " + id); // 🔥 prueba visual

        router.push(`/registro?id=${id}`);
      };

    } catch (error) {
      setMensaje("Error: NFC no soportado o sin permisos");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Lector NFC</h1>
      <p>{mensaje}</p>
    </div>
  );
}