import { useCallback, useState } from 'react'
import Header from '@/components/layout/Header.jsx'
import SignIn from '@/components/sign-in/SignIn.jsx'
import Footer from '@/components/layout/Footer.jsx'
import MainContent from '@/components/layout/MainContent.jsx'
import { Route, Routes } from 'react-router-dom'
import VideoTable from '@/components/video-table/VideoTable.jsx'
import useAuth from '@/auth/useAuth.js'

function App () {
  const [mailLink, setMailLink] = useState(null)
  const { user, getAccessToken } = useAuth()

  function wait (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const createMailLink = useCallback(
    async (id) => {
      try {
        const token = await getAccessToken()
        if (!token) {
          return
        }
        const response = await fetch(
          `https://ergopro-ecloud.equeo.de/rest/v1/videos/renditions/${id}`,
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )

        if (!response.ok) {
          return ''
        }
        const result = await response.json()
        const renditions = result.media_renditions

        if (renditions.length === 0) {
          return ''
        }

        const videoRenditions = renditions.filter((r) => {
          return r.media_type === 'video'
        })

        if (videoRenditions.length === 0) {
          return ''
        }

        const allVideosReady = videoRenditions.every((r) => {
          return (
            typeof r.delivery_url === 'string' && r.delivery_url.trim() !== ''
          )
        })

        if (!allVideosReady) {
          return ''
        }

        const video = videoRenditions.sort((a, b) => b.height - a.height)[0]

        const url = video.delivery_url.replace(
          'cdn.jwplayer.com',
          'cdn.equeo.de',
        )

        setMailLink(url)
        return url
      } catch (e) {
        console.error(e)
        return ''
      }
    },
    [getAccessToken],
  )

  async function pollForMailLink (id, maxAttempts = 1000, delay = 5000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const mailUrl = await createMailLink(id)

      if (mailUrl && mailUrl !== '') {
        return mailUrl
      }
      await wait(delay)
    }
    return ''
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-white">
      <Header/>

      {user !== null ? (
        <Routes>
          <Route
            path="/upload"
            element={<MainContent mailLink={mailLink} pollForMailLink={pollForMailLink} />}
          />

          <Route
            path="/videotable"
            element={<VideoTable createMailLink={createMailLink}/>}
          />

          <Route
            path="*"
            element={<MainContent mailLink={mailLink} pollForMailLink={pollForMailLink} />}
          />
        </Routes>
      ) : (
        <SignIn/>
      )}

      <Footer/>
    </div>
  )
}

export default App
