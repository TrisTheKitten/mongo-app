"use client";

export default function CategoryForm({ register, handleSubmit, onSubmit, editMode, onCancel }) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("_id")} />
      <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
        <div>Category name:</div>
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
            {...register("order", { required: true })}
            className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="col-span-2 text-right">
          {editMode ? (
            <>
              <input
                type="submit"
                className="italic bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                value="Update"
              />
              {" "}
              <button
                type="button"
                onClick={onCancel}
                className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Cancel
              </button>
            </>
          ) : (
            <input
              type="submit"
              value="Add"
              className="w-20 italic bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            />
          )}
        </div>
      </div>
    </form>
  );
}


