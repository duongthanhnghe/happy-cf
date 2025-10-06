import { useUserAuthStore } from '@/stores/client/users/useUserAuthStore'

export const useGoogleAuth = () => {
  const config = useRuntimeConfig()
  const googleButtonId = 'google-signin-button'
  
  const initializeGoogleSignIn = () => {
    if (typeof window === 'undefined') return

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      // @ts-ignore
      if (window.google) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: config.public.GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
        })
      }
    }
  }

  const handleCredentialResponse = (response: any) => {
    if (response.credential) {
      const store = useUserAuthStore()
      store.handleGoogleLogin(response)
    }
  }

  const renderButton = (elementId: string) => {
    if (typeof window === 'undefined') return
    
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        { 
          theme: 'outline', 
          size: 'large',
          text: 'signin_with',
          locale: 'vi'
        }
      )
    }
  }

  // const promptGoogleOneTap = () => {
  //   if (typeof window === 'undefined') return
    
  //   // @ts-ignore
  //   if (window.google) {
  //     // @ts-ignore
  //     window.google.accounts.id.prompt()
  //   }
  // }

  return {
    googleButtonId,
    initializeGoogleSignIn,
    renderButton,
    // promptGoogleOneTap,
  }
}