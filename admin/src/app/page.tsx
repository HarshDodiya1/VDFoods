import ProtectedRoute from '@/components/ProtectedRoute';
import AdminNavbar from '@/components/AdminNavbar';
import AdminDashboard from '@/components/AdminDashboard';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <AdminDashboard />
      </div>
    </ProtectedRoute>
  );
}
