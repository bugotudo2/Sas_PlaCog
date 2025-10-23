import { Building2, Star } from 'lucide-react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hotel Doho</h1>
                <p className="text-sm text-gray-600">Sistema de Reservas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">4.8</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container text-center">
          <p className="text-sm text-gray-600">
            © 2024 Hotel Doho. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Sistema de gestão hoteleira
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
