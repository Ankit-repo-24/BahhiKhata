import '../styles/globals.css'
import Head from 'next/head'
import { useEffect } from 'react'
import { supabase } from '../utils/supabase'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Restore session from localStorage
    const session = localStorage.getItem('supabase_session')
    if (session) {
      const parsedSession = JSON.parse(session)
      supabase.auth.setSession(parsedSession)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Bahhi-Khata - Smart Expense Tracker</title>
        <meta name="description" content="Track your expenses effortlessly with our modern, secure expense management app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp