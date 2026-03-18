import { useCallback, useState } from "react";
import Header from "@/components/Header.jsx";
import SignIn from "@/components/SignIn.jsx";
import Footer from "@/components/Footer.jsx";
import MainContent from "@/components/MainContent.jsx";
import { Redirect, Route, Switch } from "react-router-dom";
import VideoGallery from "@/components/VideoGallery.jsx";
import getUser from "./utils/GetUser";
import getAccessToken from "@/utils/Auth.js";

function App() {
  const [mailLink, setMailLink] = useState(null);
  const [user, setUser] = useState(() => getUser());

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const createMailLink = useCallback(async (id) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error("No access token available");
        return;
      }
      const response = await fetch(
        `https://ergopro-ecloud.equeo.de/rest/v1/videos/renditions/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      if (!response.ok) {
        console.error(`Fehler bei Renditions für ${id}: ${response.status}`);
        return "";
      }
      const result = await response.json();
      const renditions = result.media_renditions;
      console.log(renditions);

      if (renditions.length === 0) {
        return "";
      }

      const videoRenditions = renditions.filter((r) => {
        return r.media_type === "video";
      });

      if (videoRenditions.length === 0) {
        return "";
      }

      const allVideosReady = videoRenditions.every((r) => {
        return (
          typeof r.delivery_url === "string" && r.delivery_url.trim() !== ""
        );
      });

      if (!allVideosReady) {
        return "";
      }

      const video = videoRenditions.sort((a, b) => b.height - a.height)[0];

      if (!video?.delivery_url) {
        return "";
      }

      const url = video.delivery_url.replace(
        "cdn.jwplayer.com",
        "cdn.equeo.de",
      );
      setMailLink(url);
      return url;
    } catch (e) {
      console.error(e);
      return "";
    }
  }, []);

  async function pollForMailLink(id, maxAttempts = 1000, delay = 5000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const mailUrl = await createMailLink(id);

      if (mailUrl && mailUrl !== "") {
        return mailUrl;
      }

      console.log(
        `Noch keine Rendition. Versuch ${attempt} von ${maxAttempts}`,
      );

      await wait(delay);
    }

    return "";
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-white">
      <Header setUser={setUser} />

      {user !== null ? (
        <Switch>
          <Route exact path="/">
            <Redirect to="/upload" />
          </Route>

          <Route
            path="/upload"
            render={() => (
              <MainContent
                mailLink={mailLink}
                pollForMailLink={pollForMailLink}
              />
            )}
          />

          <Route
            path="/gallery"
            render={() => <VideoGallery createMailLink={createMailLink} />}
          />

          <Route>
            <Redirect to="/upload" />
          </Route>
        </Switch>
      ) : (
        <SignIn setUser={setUser} />
      )}

      <Footer />
    </div>
  );
}

export default App;
