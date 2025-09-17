import Category from "@/models/Category";

export async function GET(request) {
  // console.log('GET /api/category',request.nextUrl.searchParams.get("pno"))
  const pno = request.nextUrl.searchParams.get("pno")
  if (pno) {
    const size = 3 // TODO fix this hard code
    const startIndex = (pno - 1) * size
    const categories = await Category.find()
      .sort({ order: -1 })
      .skip(startIndex)
      .limit(size)
    return Response.json(categories)
  }

  const s = request.nextUrl.searchParams.get("s")
  if (s) {
    const categories = await Category
      .find({ name: { $regex: s, $options: 'i' } })
      .sort({ order: -1 })
    return Response.json(categories)
  }

  const categories = await Category.find().sort({ order: -1 })
  return Response.json(categories)
}

export async function POST(request) {
  const body = await request.json()
  const category = new Category(body)
  await category.save()
  return Response.json(category)
}



// for V2
export async function PUT(request) {
  const body = await request.json()
  const { _id, updateData } = body
  if (!_id || !updateData || typeof updateData !== 'object') {
    return new Response('Invalid payload: expected {_id, updateData}', { status: 400 })
  }
  const category = await Category.findByIdAndUpdate(_id, updateData, { new: true })
  if (!category) {
    return new Response('Category not found', { status: 404 })
  }
  return Response.json(category)
}

export async function PATCH(request) {
  const body = await request.json()
  const { _id, updateData } = body
  if (!_id || !updateData || typeof updateData !== 'object') {
    return new Response('Invalid payload: expected {_id, updateData}', { status: 400 })
  }
  const category = await Category.findByIdAndUpdate(_id, updateData, { new: true })
  if (!category) {
    return new Response('Category not found', { status: 404 })
  }
  return Response.json(category)
}