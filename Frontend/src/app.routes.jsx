import { createBrowserRouter } from 'react-router';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Protected from './features/auth/components/Protected';
import Home from './features/Home/pages/Home';

export const router = createBrowserRouter([
  {
    path: "/",
    // inporting home in protected route
    element: <Protected> <Home /> </Protected>
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);