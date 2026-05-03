"use client";

export default function Home() {
  return (
    <div style={{ padding: 50 }}>
      <button
  onTouchStart={() => alert("TOUCH FUNCIONA")}
  style={{ padding: 20 }}
>
  PROBAR TOUCH
</button>
    </div>
  );
}