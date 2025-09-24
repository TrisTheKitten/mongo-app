"use client";
import CategoryForm from "@/app/components/CategoryForm";
import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { resolveApiBaseUrl } from "@/lib/apiBase";

export default function Home() {

  const apiBaseUrl = resolveApiBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE,
    process.env.NEXT_PUBLIC_BASE_PATH
  );
  const categoryEndpoint = `${apiBaseUrl}/category`;

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

  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchCategory = useCallback(async () => {
    const response = await fetch(categoryEndpoint, { cache: "no-store" });
    if (!response.ok) {
      console.error(`Failed to fetch categories: ${response.status}`);
      setCategoryList([]);
      return;
    }
    const categories = await response.json();
    const formattedCategories = categories.map((category) => {
      return {
        ...category,
        id: category._id
      }
    })
    setCategoryList(formattedCategories);
  }, [categoryEndpoint]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  function handleAdd(data) {
    const { _id, ...categoryPayload } = data;
    fetch(categoryEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryPayload),
    }).then(() => {
      fetchCategory();
      reset({ name: "", order: "" });
    });
  }

  function handleEdit(data) {
    const { _id, name, order } = data;
    fetch(categoryEndpoint, {
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
    const response = await fetch(`${categoryEndpoint}/${id}`, { cache: "no-store" });
    if (!response.ok) {
      console.error(`Failed to fetch category ${id}: ${response.status}`);
      return;
    }
    const full = await response.json();
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
    await fetch(`${categoryEndpoint}/${id}`, {
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
