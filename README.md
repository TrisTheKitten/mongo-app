# Product App
Next.js 14
This app shows
1. MongoDB CRUD operations using Mongoose
2. Client Components interacting with APIs
3. Server Components Interacting with Server Actions

# Setup
1. Define in .env the followings
1.1 MONGODB_URI
1.2 NEXT_PUBLIC_API_BASE

## Models

Product
- code: String
- name: String
- description: String
- price: Number
- category: ObjectId of Category, default: null

Category
- name: String
- order: Number (used for sorting in UI)

Note: When updating a Mongoose schema, drop the affected collection and restart the Next.js server, because the driver caches models. Example: after adding `order` to `Category`, delete the `categories` collection and restart the dev server.

## Product API

- POST `/api/product`
  - payload: Product
  - returns: Product with new _id
  - test:
    ```bash
    curl -X POST -H "Content-Type: application/json" \
      -d '{"code":"p123","name":"Cup","description":"a humble little cup","price":10}' \
      localhost:3000/api/product
    ```

- GET `/api/product`
  - returns: Array of Products
  - test:
    ```bash
    curl localhost:3000/api/product
    ```

- GET `/api/product/[id]`
  - returns: Product by id
  - test:
    ```bash
    curl localhost:3000/api/product/__OBJECT_ID__
    ```

- PUT `/api/product`
  - payload: `{ "_id": "__OBJECT_ID__", "updateData": { ...fields } }`
  - returns: Updated Product
  - test:
    ```bash
    curl -X PUT -H "Content-Type: application/json" \
      -d '{"_id":"__OBJECT_ID__","updateData":{"code":"p123","name":"Big Cup","description":"a massive cup","price":1000}}' \
      localhost:3000/api/product
    ```

- PATCH `/api/product`
  - payload: `{ "_id": "__OBJECT_ID__", "updateData": { ...partialFields } }`
  - returns: Updated Product
  - test:
    ```bash
    curl -X PATCH -H "Content-Type: application/json" \
      -d '{"_id":"__OBJECT_ID__","updateData":{"price":1000}}' \
      localhost:3000/api/product
    ```

- DELETE `/api/product/[id]`
  - returns: Deleted Product
  - test:
    ```bash
    curl -X DELETE localhost:3000/api/product/__OBJECT_ID__
    ```

## Category API

- POST `/api/category`
- GET `/api/category`
- GET `/api/category/[id]`
- PUT `/api/category` with `{ "_id": "__OBJECT_ID__", "updateData": { ... } }`
- PATCH `/api/category` with `{ "_id": "__OBJECT_ID__", "updateData": { ... } }`
- DELETE `/api/category/[id]`



## UI: DataGrid for Category

### Install UI dependencies

```bash
pnpm add @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-data-grid
```

### Usage notes

- Category list at `app/v2/category/page.js` uses MUI DataGrid with a custom toolbar (`app/v2/components/CategoryGridToolbar.js`).
- The DataGrid expects each row to have an `id`. API items are mapped from `_id` to `id`.
- Quick filter, export, columns toggle, filter, and density controls are enabled in the toolbar.
- Configure `NEXT_PUBLIC_API_BASE` in `.env` so the client fetches `/api/category` correctly.
