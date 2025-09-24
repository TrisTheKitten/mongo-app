import Category from "@/models/Category"
import dbConnect from "@/lib/db"

const PAGE_SIZE = 3

export async function GET(request) {
  await dbConnect()

  const pno = request.nextUrl.searchParams.get("pno")
  if (pno) {
    const pageNumber = Number(pno)
    if (!Number.isNaN(pageNumber) && pageNumber > 0) {
      const startIndex = (pageNumber - 1) * PAGE_SIZE
      const categories = await Category.find()
        .sort({ order: -1 })
        .skip(startIndex)
        .limit(PAGE_SIZE)
      return Response.json(categories)
    }
  }

  const s = request.nextUrl.searchParams.get("s")
  if (s) {
    const categories = await Category.find({ name: { $regex: s, $options: "i" } })
      .sort({ order: -1 })
    return Response.json(categories)
  }

  const categories = await Category.find().sort({ order: -1 })
  return Response.json(categories)
}

export async function POST(request) {
  await dbConnect()

  const body = await request.json()
  const category = new Category(body)
  await category.save()
  return Response.json(category)
}

export async function PUT(request) {
  await dbConnect()

  const body = await request.json()
  const { _id, updateData } = body
  if (!_id || !updateData || typeof updateData !== "object") {
    return new Response("Invalid payload: expected {_id, updateData}", { status: 400 })
  }
  const category = await Category.findByIdAndUpdate(_id, updateData, { new: true })
  if (!category) {
    return new Response("Category not found", { status: 404 })
  }
  return Response.json(category)
}

export async function PATCH(request) {
  await dbConnect()

  const body = await request.json()
  const { _id, updateData } = body
  if (!_id || !updateData || typeof updateData !== "object") {
    return new Response("Invalid payload: expected {_id, updateData}", { status: 400 })
  }
  const category = await Category.findByIdAndUpdate(_id, updateData, { new: true })
  if (!category) {
    return new Response("Category not found", { status: 404 })
  }
  return Response.json(category)
}