"use client";
import { useEffect, useState } from "react";
import { resolveApiBaseUrl } from "@/lib/apiBase";

import CategoryForm from "@/app/v2/components/forms/CategoryForm";

import CustomToolbar from "@/app/v2/components/CategoryGridToolbar";
import { DataGrid } from "@mui/x-data-grid";

import Modal from "@mui/material/Modal";


import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";

export default function Home() {
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const DEFAULT_PAGE_SIZE = 10;
  const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

  const columns = [
    { field: "name", headerName: "Category Name", width: 220 },
    { field: "order", headerName: "Order", width: 100, type: "number" },
  ];

  const APIBASE = resolveApiBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE,
    process.env.NEXT_PUBLIC_BASE_PATH
  );
  async function fetchCategory() {
    setIsLoading(true);
    try {
      const response = await fetch(`${APIBASE}/category`);
      const result = await response.json();
      const mapped = result.map((item) => ({ ...item, id: item._id }));
      setCategory(mapped);
    } finally {
      setIsLoading(false);
    }
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchCategory();
  }, []);

  async function handleCategoryFormSubmit(data) {
    await fetch(`${APIBASE}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setOpen(false);
    await fetchCategory();
  }

  return (
    <main>
      {/* <form onSubmit={handleSubmit(createCategory)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4">
          <div>Category:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>Order:</div>
          <div>
            <input
              name="order"
              type="number"
              {...register("order", { required: true, defaultValue: 0 })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className="col-span-2 text-right">
            {editMode ?
              <input
                type="submit"
                value="Update"
                className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              />

              :
              <input
                type="submit"
                value="Add"
                className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            }
            {
              editMode &&
              <button
                onClick={() => {
                  reset({ name: '', order: '' })
                  setEditMode(false)
                }}
                className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
              >Cancel</button>
            }
          </div>
        </div>
      </form> */}
      <div className="mx-4">
        <span>Category ({category.length})</span>
        <IconButton aria-label="new-category" color="secondary" onClick={handleOpen}>
          <AddBoxIcon />
        </IconButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <CategoryForm onSubmit={handleCategoryFormSubmit} />
        </Modal>
        <DataGrid
          rows={category}
          columns={columns}
          autoHeight
          loading={isLoading}
          disableRowSelectionOnClick
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: DEFAULT_PAGE_SIZE } },
          }}
          slots={{ toolbar: CustomToolbar }}
        />
      </div>
    </main>
  );
}
