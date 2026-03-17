import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import StudentDashboard from '@/components/StudentDashboard'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StudentDashboard />
    </QueryClientProvider>
  )
}

export default App
