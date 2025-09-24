import Product from "@/models/Product"
import dbConnect from "@/lib/db"

export async function GET() {
  await dbConnect()

  const products = await Product.find()
  return Response.json(products)
}

export async function POST(request) {
  await dbConnect()

  const body = await request.json()
  const product = new Product(body)
  await product.save()
  return Response.json(product)
}

export async function PUT(request) {
  await dbConnect()

  const body = await request.json()
  const { _id, updateData } = body
  if (!_id || !updateData || typeof updateData !== "object") {
    return new Response("Invalid payload: expected {_id, updateData}", { status: 400 })
  }
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true })
  if (!product) {
    return new Response("Product not found", { status: 404 })
  }
  return Response.json(product)
}

export async function PATCH(request) {
  await dbConnect()

  const body = await request.json()
  const { _id, updateData } = body
  if (!_id || !updateData || typeof updateData !== "object") {
    return new Response("Invalid payload: expected {_id, updateData}", { status: 400 })
  }
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true })
  if (!product) {
    return new Response("Product not found", { status: 404 })
  }
  return Response.json(product)
}