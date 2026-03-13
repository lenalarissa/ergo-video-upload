import {useCallback, useMemo, useState} from 'react'
import Header from "@/components/Header.jsx";
import SignIn from "@/components/SignIn.jsx";
import Footer from "@/components/Footer.jsx";
import MainContent from "@/components/MainContent.jsx";
import {Redirect, Route, Switch} from "react-router-dom";
import VideoGallery from "@/components/VideoGallery.jsx";
import {AuthContext} from '@/library/pageComponents/AuthContext'

function App() {

    const [mailLink, setMailLink] = useState("https://cdn.jwplayer.com/videos/8eF2KHP5-L8vacHUe.mp4");

    const [user, setUser] = useState(null);

    const refreshAuth = useCallback(async () => {
        return user;
    }, [user]);

    const authContextValue = useMemo(() => ({
        refreshAuth,
        user
    }), [refreshAuth, user]);

    const createMailLink = useCallback(async (id)=> {
        try {
            const response = await fetch(`https://ergopro-ecloud.equeo.de/rest/v1/videos/renditions/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                }
            });

            if (!response.ok) {
                console.error(`Fehler bei Renditions für ${id}: ${response.status}`);
                return "-";
            }
            const result = await response.json();
            const renditions = result.media_renditions;
            console.log(renditions);

            const videoRenditions = renditions.filter(r => r.media_type === "video");
            if (videoRenditions.length === 0){
                return "-";
            }

            const video = videoRenditions.sort((a, b) => b.height - a.height)[0];
            console.log(video);
            const url = video.delivery_url.replace("cdn.jwplayer.com", "cdn.equeo.de");
            setMailLink(url);
            return url;
        } catch (e) {
            console.error(e);
            return "-";
        }
    }, []);


    return (
        <div className="flex flex-col gap-4 min-h-screen bg-white">
            <AuthContext.Provider value={authContextValue}>
                <Header setUser={setUser}/>

                {user !== null ? (
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/upload"/>
                        </Route>

                        <Route
                            path="/upload"
                            render={() => <MainContent mailLink={ mailLink }/>}
                        />

                        <Route
                            path="/gallery"
                            render={() => <VideoGallery createMailLink={createMailLink}/>}
                        />

                        <Route>
                            <Redirect to="/upload"/>
                        </Route>
                    </Switch>
                ) : (
                    <SignIn setUser={setUser}/>
                )}

                <Footer/>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
