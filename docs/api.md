# DOT Articles API Documentation

## Info

- **Title:** DOT Articles
- **Description:** DOT Articles API Documentation
- **Version:** 1.0
- **Contact:**

## Servers

- **URL:** `/api/v1`

## Security Schemes

### Bearer

- **Type:** http
- **Scheme:** bearer
- **Bearer Format:** JWT

## Tags

- Users
- Authentication
- Articles
- Categories

## Paths

### `/`

#### GET

- **Operation ID:** `AppController_getHello`
- **Responses:**
  - `200`:

---

### `/users/me`

#### GET

- **Operation ID:** `UsersController_findMe`
- **Tags:** Users
- **Security:**
  - Bearer
- **Responses:**
  - `200`:

---

### `/users`

#### PATCH

- **Operation ID:** `UsersController_updateMe`
- **Tags:** Users
- **Security:**
  - Bearer
- **Request Body:**
  - **Required:** true
  - **Content:**
    - **Application/JSON:**
      - **Schema:** [UpdateUserDto](#updateuserdto)
- **Responses:**
  - `200`:

---

### `/auth/register`

#### POST

- **Operation ID:** `AuthController_register`
- **Tags:** Authentication
- **Request Body:**
  - **Required:** true
  - **Content:**
    - **Application/JSON:**
      - **Schema:** [CreateUserDto](#createuserdto)
- **Responses:**
  - `200`:

---

### `/auth/login`

#### POST

- **Operation ID:** `AuthController_signIn`
- **Tags:** Authentication
- **Request Body:**
  - **Required:** true
  - **Content:**
    - **Application/JSON:**
      - **Schema:** [LoginDto](#logindto)
- **Responses:**
  - `200`:

---

### `/auth/login/google`

#### GET

- **Operation ID:** `AuthController_googleAuth`
- **Tags:** Authentication
- **Responses:**
  - `200`:

---

### `/auth/google/callback`

#### GET

- **Operation ID:** `AuthController_googleAuthRedirect`
- **Tags:** Authentication
- **Responses:**
  - `200`:

---

### `/articles`

#### GET

- **Operation ID:** `ArticlesController_findAll`
- **Tags:** Articles
- **Security:**
  - Bearer
- **Responses:**
  - `200`:

#### POST

- **Operation ID:** `ArticlesController_store`
- **Tags:** Articles
- **Security:**
  - Bearer
- **Request Body:**
  - **Required:** true
  - **Content:**
    - **Application/JSON:**
      - **Schema:** [CreateArticleDto](#createarticledto)
- **Responses:**
  - `201`:

---

### `/articles/{slug}`

#### GET

- **Operation ID:** `ArticlesController_findOne`
- **Tags:** Articles
- **Security:**
  - Bearer
- **Parameters:**
  - **Slug:**
    - **Required:** true
    - **In:** path
    - **Schema:** string
- **Responses:**
  - `200`:

#### PUT

- **Operation ID:** `ArticlesController_update`
- **Tags:** Articles
- **Security:**
  - Bearer
- **Parameters:**
  - **Slug:**
    - **Required:** true
    - **In:** path
    - **Schema:** string
- **Request Body:**
  - **Required:** true
  - **Content:**
    - **Application/JSON:**
      - **Schema:** [UpdateArticleDto](#updatearticledto)
- **Responses:**
  - `200`:

#### DELETE

- **Operation ID:** `ArticlesController_remove`
- **Tags:** Articles
- **Security:**
  - Bearer
- **Parameters:**
  - **Slug:**
    - **Required:** true
    - **In:** path
    - **Schema:** string
- **Responses:**
  - `200`:

---

### `/categories`

#### GET

- **Operation ID:** `CategoriesController_findAll`
- **Tags:** Categories
- **Security:**
  - Bearer
- **Responses:**
  - `200`:

#### POST

- **Operation ID:** `CategoriesController_store`
- **Tags:** Categories
- **Security:**
  - Bearer
- **Request Body:**
  - **Required:** true
  - **Content:**
    - **Application/JSON:**
      - **Schema:** [CreateCategoryDto](#createcategorydto)
- **Responses:**
  - `201`:

---

### `/categories/{id}`

#### PATCH

- **Operation ID:** `CategoriesController_update`
- **Tags:** Categories
- **Security:**
  - Bearer
- **Parameters:**
  - **Id:**
    - **Required:** true
    - **In:** path
    - **Schema:** string
- **Request Body:**
  - **Required:** true
  - **Content:**
    - **Application/JSON:**
      - **Schema:** [UpdateCategoryDto](#updatecategorydto)
- **Responses:**
  - `200`:

#### DELETE

- **Operation ID:** `CategoriesController_remove`
- **Tags:** Categories
- **Security:**
  - Bearer
- **Parameters:**
  - **Id:**
    - **Required:** true
    - **In:** path
    - **Schema:** string
- **Responses:**
  - `200`:

---

## Components

### Schemas

#### UpdateUserDto

```json
{
  "type": "object",
  "properties": {
    "password": { "type": "string", "example": "password123" },
    "fullName": { "type": "string", "example": "John Doe" },
    "bio": { "type": "string", "example": "Software Engineer" },
    "avatarUrl": {
      "type": "string",
      "example": "https://example.com/avatar.jpg"
    },
    "role": { "type": "string", "example": "admin" }
  },
  "required": ["password", "fullName", "bio", "avatarUrl", "role"]
}
```

#### CreateUserDto

```json
{
  "type": "object",
  "properties": {
    "username": { "type": "string", "example": "username" },
    "email": { "type": "string", "example": "user@example.com" },
    "password": { "type": "string", "example": "password123" },
    "fullName": { "type": "string", "example": "John Doe" },
    "bio": { "type": "string", "example": "Software Engineer" },
    "avatarUrl": {
      "type": "string",
      "example": "https://example.com/avatar.jpg"
    },
    "role": { "type": "string", "example": "admin" }
  },
  "required": [
    "username",
    "email",
    "password",
    "fullName",
    "bio",
    "avatarUrl",
    "role"
  ]
}
```

#### LoginDto

```json
{
  "type": "object",
  "properties": {
    "email": { "type": "string", "example": "user@example.com" },
    "password": { "type": "string", "example": "password123" }
  },
  "required": ["email", "password"]
}
```

#### CreateArticleDto

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "example": "My first article" },
    "content": { "type": "string", "example": "lorem ipsum" },
    "status": { "type": "string", "example": "draft" },
    "categoryIds": {
      "example": [1, 2],
      "type": "array",
      "items": { "$ref": "#/components/schemas/categoriesArticle" }
    }
  },
  "required": ["title", "content", "status", "categoryIds"]
}
```

#### UpdateArticleDto

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "example": "My first article" },
    "content": { "type": "string", "example": "lorem ipsum" },
    "status": { "type": "string", "example": "draft" },
    "categoryIds": {
      "example": [1, 2],
      "type": "array",
      "items": { "$ref": "#/components/schemas/categoriesArticle" }
    }
  },
  "required": ["title", "content", "status", "categoryIds"]
}
```

#### CreateCategoryDto

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "example": "Category Name" },
    "description": { "type": "string", "example": "Category Description" }
  },
  "required": ["name", "description"]
}
```

#### UpdateCategoryDto

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "example": "Category Name" },
    "description": { "type": "string", "example": "Category Description" }
  },
  "required": ["name", "description"]
}
```

---
