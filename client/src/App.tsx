import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./utils/Auth/AuthContext";
import { SearchProvider } from "./utils/SearchQuery/SearchContext";
import router from "./router";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
      <RouterProvider router={router} />
      </SearchProvider>
    </AuthProvider>
  );
}

export default App
