"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  console.debug("API_BASE", API_BASE);
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [editMode, setEditMode] = useState(false);

  async function fetchProducts() {
    const data = await fetch(`${API_BASE}/product`);
    // const data = await fetch(`${API_BASE}/product`);
    const p = await data.json();
    setProducts(p);
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  const handleAdd = (data) => {
    fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchProducts();
      reset({ code: "", name: "", description: "", price: "", category: category[0]?._id || "" });
    });
  };

  const handleEdit = (data) => {
    const { _id, code, name, description, price, category: categoryId } = data;
    fetch(`${API_BASE}/product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id, updateData: { code, name, description, price, category: categoryId } }),
    }).then(() => {
      setEditMode(false);
      reset({ code: "", name: "", description: "", price: "", category: category[0]?._id || "" });
      fetchProducts();
    });
  };

  const startEditMode = async (product) => {
    const id = product._id;
    const res = await fetch(`${API_BASE}/product/${id}`, { cache: "no-store" });
    const full = await res.json();
    const formData = {
      _id: full._id,
      code: full.code,
      name: full.name,
      description: full.description,
      price: full.price,
      category: full.category?._id || "",
    };
    reset(formData);
    setEditMode(true);
  };

  const stopEditMode = () => {
    setEditMode(false);
    reset({ code: "", name: "", description: "", price: "", category: category[0]?._id || "" });
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;
    
    await fetch(`${API_BASE}/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  }

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1 w-64 ">
        <form onSubmit={handleSubmit(editMode ? handleEdit : handleAdd)}>
          <input type="hidden" {...register("_id")} />
          <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
            <div>Code:</div>
            <div>
              <input
                name="code"
                type="text"
                {...register("code", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Description:</div>
            <div>
              <textarea
                name="description"
                {...register("description", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Price:</div>
            <div>
              <input
                name="name"
                type="number"
                {...register("price", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Category:</div>
            <div>
              <select
                name="category"
                {...register("category", { required: true })}
                className="border border-black w-full"
              >
                {category.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              {editMode ? (
                <>
                  <input
                    type="submit"
                    value="Update"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                  {" "}
                  <button
                    type="button"
                    onClick={stopEditMode}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <input
                  type="submit"
                  value="Add"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="border m-4 bg-slate-300 flex-1 w-64">
        <h1 className="text-2xl">Products ({products.length})</h1>
        <ul className="list-disc ml-8">
          {
            products.map((p) => (
              <li key={p._id}>
                <button className="border border-black p-1/2" onClick={deleteById(p._id)}>❌</button>{' '}
                <button className="border border-black p-1/2" onClick={() => startEditMode(p)}>📝</button>{' '}
                <Link href={`/product/${p._id}`} className="font-bold">
                  {p.name}
                </Link>{" "}
                - {p.description}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
