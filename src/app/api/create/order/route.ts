import createOrder from "src/service/createOrderService";
export async function POST(req: Request) {
  const resultRaq = await createOrder(req);
  console.log(resultRaq);
}
