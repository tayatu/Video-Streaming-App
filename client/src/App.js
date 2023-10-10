import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import SubscribedChannels from "./pages/SubscribedChannels";
import Subscribers from "./pages/Subscriber";
import UploadPage from "./pages/UploadPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/">
            <Route index element={<Home type="random" />} />
            <Route path="trends" element={<Home type="trends" />} />
            <Route path="subscribed" element={<Home type="subscribed" />} />
            <Route path="search" element={<Search />} />

            <Route
              path="subscribed-channels"
              element={<SubscribedChannels />}
            />

            <Route path="subscribers" element={<Subscribers />} />

            <Route path="upload" element={<UploadPage />} />

            <Route path="video">
              <Route path=":id" element={<Video />} />
            </Route>
            <Route path="signin" element={<SignIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
