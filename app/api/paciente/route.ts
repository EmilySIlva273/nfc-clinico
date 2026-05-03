export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const pacientes: any = {
    "123ABC": {
      dni: "12345678",
      nombre: "Juan Perez"
    }
  };

  return Response.json(pacientes[id as string] || {});
}