"use client";
import CategoryForm from "@/app/components/CategoryForm";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {

  const columns = [
    // { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'order', headerName: 'Order', width: 150 },
    {
      field: 'Action', headerName: 'Action', width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button onClick={() => startEditMode(params.row)}>📝</button>
            <button onClick={() => deleteCategory(params.row)}>🗑️</button>
          </div>
        )
      }
    },
  ]

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  console.log(process.env.NEXT_PUBLIC_API_BASE)

  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      return {
        ...category,
        id: category._id
      }
    })
    setCategoryList(c2);
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function handleAdd(data) {
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchCategory();
      reset({ name: "", order: "" });
    });
  }

  function handleEdit(data) {
    const { _id, name, order } = data;
    fetch(`${API_BASE}/category`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id, updateData: { name, order } }),
    }).then(() => {
      stopEditMode();
      fetchCategory();
    });
  }

  async function startEditMode(category) {
    const id = category._id;
    const res = await fetch(`${API_BASE}/category/${id}`, { cache: "no-store" });
    const full = await res.json();
    reset(full);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: '',
      order: ''
    })
    setEditMode(false)
  }

  async function deleteCategory(category) {
    if (!confirm(`Are you sure to delete [${category.name}]`)) return;

    const id = category._id
    await fetch(`${API_BASE}/category/${id}`, {
      method: "DELETE"
    })
    fetchCategory()
  }

  return (
    <main>
      <CategoryForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={editMode ? handleEdit : handleAdd}
        editMode={editMode}
        onCancel={stopEditMode}
      />

      <div className="mx-4">
        <DataGrid
          rows={categoryList}
          columns={columns}
        />
      </div>

      {/* <div className="ml-4">
        <h1 className="text-xl font-bold">Category ({categoryList.length})</h1>
        {categoryList.map((category) => (
          <div key={category._id} className="ml-4">
            ‣
            <button onClick={() => startEditMode(category)} className="mr-2">📝</button>
            <button onClick={() => deleteCategory(category)} className="mr-2">🗑️</button>
            <Link href={`/product/category/${category._id}`} className="text-red-600">
              {category.name} → {category.order}
            </Link>
          </div>
        ))}
      </div> */}
    </main>
  );
}
