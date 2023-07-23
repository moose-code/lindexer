import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NFTPage from "./pages/NFTPage";
import CollectionPage from "./pages/CollectionPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    // {
    //   path: "nft/:nft",
    //   element: <NFTPage />,
    // },
    {
      path: "collection/:collection",
      element: <CollectionPage />,
    },
  ]);

  return (
    <div className="min-h-[100vh] flex flex-col h-full w-full items-center justify-center bg-black text-white">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
