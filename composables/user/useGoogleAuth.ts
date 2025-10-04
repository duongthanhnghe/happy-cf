import { useUserAuthStore } from '@/stores/client/users/useUserAuthStore'


export const useGoogleAuth = () => {
  const config = useRuntimeConfig()
  
  const initializeGoogleSignIn = () => {
    if (typeof window === 'undefined') return

    // Load Google Identity Services script
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
    console.log('Google credential response:', response)
    // Response sẽ có response.credential (ID token)
    
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
          width: 300,
          text: 'signin_with',
          locale: 'vi'
        }
      )
    }
  }

  const promptGoogleOneTap = () => {
    if (typeof window === 'undefined') return
    
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      window.google.accounts.id.prompt()
    }
  }

  return {
    initializeGoogleSignIn,
    renderButton,
    promptGoogleOneTap,
  }
}