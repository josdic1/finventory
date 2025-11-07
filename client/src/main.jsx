import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import routes from './routes'

const router = createBrowserRouter(routes)

const root = createRoot(document.getElementById('root'))
root.render(<RouterProvider router={router}/>)
