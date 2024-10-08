import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { Home } from './components/Home'
import { InputForm } from './components/InputForm'
import { CompletionRate } from './components/CompletionRate'
import { CsvUpload } from './components/CsvUpload'
import { Flag, Home as HomeIcon, PlusCircle, BarChart, Upload } from 'lucide-react'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="racing-gradient p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-white text-2xl font-bold flex items-center">
              <Flag className="mr-2" />
              ESK F1 커뮤니티
            </Link>
            <ul className="flex space-x-4 text-white">
              <li>
                <Link to="/" className="flex items-center hover:text-gray-200">
                  <HomeIcon className="mr-1" size={18} />
                  홈
                </Link>
              </li>
              <li>
                <Link to="/input" className="flex items-center hover:text-gray-200">
                  <PlusCircle className="mr-1" size={18} />
                  데이터 입력
                </Link>
              </li>
              <li>
                <Link to="/completion" className="flex items-center hover:text-gray-200">
                  <BarChart className="mr-1" size={18} />
                  완주 통계
                </Link>
              </li>
              <li>
                <Link to="/upload" className="flex items-center hover:text-gray-200">
                  <Upload className="mr-1" size={18} />
                  CSV 업로드
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/input" element={<InputForm />} />
            <Route path="/completion" element={<CompletionRate />} />
            <Route path="/upload" element={<CsvUpload />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App