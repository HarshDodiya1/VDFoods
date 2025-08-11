# VD Foods Admin Panel

A Next.js-based admin panel for managing VD Foods with authentication and dashboard features.

## Features

- 🔐 **Secure Authentication** - JWT token-based authentication with automatic redirection
- 📊 **Dashboard** - Overview of orders, users, products, and revenue
- 🛡️ **Protected Routes** - Automatic redirection to login for unauthenticated users
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Fast Performance** - Built with Next.js 15 and React 19

## Setup Instructions

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the admin directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000`

## Authentication Flow

1. **Automatic Redirection**: Users are automatically redirected to `/login` if not authenticated
2. **Login Process**: Users enter credentials which are sent to your backend API
3. **Token Storage**: JWT tokens are stored in localStorage and cookies
4. **Protected Access**: Authenticated users can access the admin dashboard
5. **Logout**: Users can logout which clears tokens and redirects to login

## API Integration

The admin panel expects the following API endpoints on your backend:

### Authentication Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify JWT token

### Dashboard Endpoints
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/orders/recent` - Get recent orders

### Expected API Response Format

#### Login Response
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

#### Dashboard Stats Response
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalOrders": 300,
    "totalProducts": 50,
    "totalRevenue": 25000
  }
}
```

## File Structure

```
admin/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── layout.tsx            # Root layout with AuthProvider
│   │   └── page.tsx              # Protected home page
│   ├── components/
│   │   ├── AdminDashboard.tsx    # Main dashboard component
│   │   ├── AdminNavbar.tsx       # Navigation bar
│   │   ├── LoadingSpinner.tsx    # Loading components
│   │   └── ProtectedRoute.tsx    # Route protection wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication context
│   └── lib/
│       └── auth.ts               # Authentication utilities
├── middleware.ts                 # Next.js middleware for route protection
└── .env.local                   # Environment variables
```

## Customization

### Adding New Protected Routes

1. Add the route to the `protectedRoutes` array in `middleware.ts`
2. Create the page component and wrap it with `ProtectedRoute`

### Styling

The project uses Tailwind CSS for styling. You can customize:
- Colors in the Tailwind config
- Component styles in individual components
- Global styles in `globals.css`

### API Integration

Update the API endpoints in `src/lib/auth.ts` to match your backend implementation.

## Dependencies

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## Security Features

- JWT token validation
- Automatic token expiration handling
- CSRF protection via SameSite cookies
- Secure token storage
- Route-level protection
