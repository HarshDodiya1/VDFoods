# Auth API Endpoints

This document provides an overview of the authentication endpoints for the spices e-commerce website, formatted with toggles for easy navigation.

---

<details>
<summary>1. Register a New User</summary>

**Endpoint:** `POST /api/auth/register`

**Description:** Creates a new user account by taking user details, validating them, hashing the password, and saving the new user to the database.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "password": "strongpassword123"
}
```

**Success Response:**

```json
{
  "message": "User registered successfully!"
}
```

**Error Responses:**

```json
{
  "message": "All fields are required."
}
```

```json
{
  "message": "User with this email already exists."
}
```

</details>

---

<details>
<summary>2. Login User</summary>

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user by verifying email and password, then generates a JWT.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "strongpassword123"
}
```

**Success Response:**

```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60a2b0c3f5d5b7a0e8f1c0d4",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

```json
{
  "message": "Email and password are required."
}
```

```json
{
  "message": "Invalid credentials"
}
```

</details>

---

<details>
<summary>3. Send OTP</summary>

**Endpoint:** `POST /api/auth/send-otp`

**Description:** Generates a 4-digit OTP, saves it to the user's document with a 5-minute expiry, and emails it.

**Request Body:**

```json
{
  "email": "john.doe@example.com"
}
```

**Success Response:**

```json
{
  "message": "OTP sent successfully."
}
```

**Error Responses:**

```json
{
  "message": "Email is required."
}
```

```json
{
  "message": "User not found."
}
```

</details>

---

<details>
<summary>4. Verify OTP</summary>

**Endpoint:** `POST /api/auth/verify-otp`

**Description:** Checks if the provided OTP matches the stored OTP and is within the expiry period.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "otp": "1234"
}
```

**Success Response:**

```json
{
  "message": "OTP verified successfully."
}
```

**Error Responses:**

```json
{
  "message": "Invalid or expired OTP."
}
```

```json
{
  "message": "User not found."
}
```

</details>

---

<details>
<summary>5. Reset Password</summary>

**Endpoint:** `POST /api/auth/reset-password`

**Description:** Updates the user's password after OTP verification.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "newPassword": "new_strong_password123"
}
```

**Success Response:**

```json
{
  "message": "Password reset successfully."
}
```

**Error Responses:**

```json
{
  "message": "New password must be at least 8 characters long."
}
```

```json
{
  "message": "User not found."
}
```

</details>

---
