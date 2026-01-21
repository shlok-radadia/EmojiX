import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import EmojiDex from "./pages/EmojiDex";
import EmojiDetails from "./pages/EmojiDetails";
import EmojiInventory from "./pages/EmojiInventory";
import ItemInventory from "./pages/ItemInventory";
import ItemMarket from "./pages/Market";
import Quests from "./pages/Quests";
import TradeMarket from "./pages/TradeMarket";
import ProfileStats from "./pages/ProfileStats";
import ProfileInventory from "./pages/ProfileInventory";
import ProfileTrades from "./pages/ProfileTrade";

export default function App() {
  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />

        <div className="pt-16 flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <Signup />
                </GuestRoute>
              }
            />

            <Route path="/profile/:userId/stats" element={<ProfileStats />} />
            <Route
              path="/profile/:userId/inventory"
              element={<ProfileInventory />}
            />
            <Route path="/profile/:userId/trades" element={<ProfileTrades />} />

            <Route
              path="/game"
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dex"
              element={
                <ProtectedRoute>
                  <EmojiDex />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dex/:emojiId"
              element={
                <ProtectedRoute>
                  <EmojiDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventory/emojis"
              element={
                <ProtectedRoute>
                  <EmojiInventory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventory/items"
              element={
                <ProtectedRoute>
                  <ItemInventory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/market"
              element={
                <ProtectedRoute>
                  <ItemMarket />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quests"
              element={
                <ProtectedRoute>
                  <Quests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/trade"
              element={
                <ProtectedRoute>
                  <TradeMarket />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
