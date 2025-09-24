import Product from "@/models/Product"
import dbConnect from "@/lib/db"

export async function GET(request, { params }) {
  await dbConnect()

  const id = params.id
  const product = await Product.findById(id).populate("category")
  return Response.json(product)
}

export async function DELETE(request, { params }) {
  await dbConnect()

  const id = params.id
  const removedProduct = await Product.findByIdAndDelete(id)
  return Response.json(removedProduct)
}
