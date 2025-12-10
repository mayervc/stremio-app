/**
 * Decode a JWT token without verifying the signature
 * This is useful for debugging JWT structure
 */
export function decodeJWT(token: string): {
  header: any
  payload: any
  signature: string
} | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid JWT format: expected 3 parts, got', parts.length)
      return null
    }

    const [headerBase64, payloadBase64, signature] = parts

    // Decode base64url (JWT uses base64url, not standard base64)
    const decodeBase64Url = (str: string): string => {
      // Replace URL-safe characters
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/')

      // Add padding if needed
      while (base64.length % 4) {
        base64 += '='
      }

      try {
        // Decode using atob (browser/web) or Buffer (Node.js/React Native)
        if (typeof atob !== 'undefined') {
          return atob(base64)
        } else if (typeof Buffer !== 'undefined') {
          return Buffer.from(base64, 'base64').toString('utf-8')
        } else {
          // Fallback for React Native - use a simple base64 decoder
          // This is a basic implementation that should work in most cases
          const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
          let output = ''
          let i = 0

          base64 = base64.replace(/[^A-Za-z0-9\+\/\=]/g, '')

          while (i < base64.length) {
            const enc1 = chars.indexOf(base64.charAt(i++))
            const enc2 = chars.indexOf(base64.charAt(i++))
            const enc3 = chars.indexOf(base64.charAt(i++))
            const enc4 = chars.indexOf(base64.charAt(i++))

            const chr1 = (enc1 << 2) | (enc2 >> 4)
            const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
            const chr3 = ((enc3 & 3) << 6) | enc4

            output += String.fromCharCode(chr1)

            if (enc3 !== 64) output += String.fromCharCode(chr2)
            if (enc4 !== 64) output += String.fromCharCode(chr3)
          }

          return output
        }
      } catch (error) {
        console.error('Error decoding base64:', error)
        return ''
      }
    }

    const headerJson = decodeBase64Url(headerBase64)
    const payloadJson = decodeBase64Url(payloadBase64)

    const header = JSON.parse(headerJson)
    const payload = JSON.parse(payloadJson)

    return {
      header,
      payload,
      signature,
    }
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}
