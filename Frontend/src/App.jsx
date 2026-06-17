// Ui -layer  -> dikhana & navigation handle krna (pages, components)
// hook layer -> State & API manage krna [hooks]
// state layer -> for storing data [auth.context.js, post.context.js]
// API layer -> for communicating frontend with the Backend [services/auth.api.js]
import { RouterProvider } from "react-router";
import { router } from './app.routes'; 
import './features/shared/styles/global.scss'  // importing global scss file 
import { AuthProvider } from "./features/auth/auth.context";
import { SongContextProvider } from "./features/Home/song.context";

const App = () => {
  return (
    // now, all states access of AuthProvider will go to the application
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
    </AuthProvider>
  );
}

export default App