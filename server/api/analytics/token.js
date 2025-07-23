import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Get the Google Analytics credentials
    const googleClientEmail = config.googleClientEmail
    let privateKey = config.googlePrivateKey

    // Function to validate private key format
    function isValidPrivateKey(key) {
      const cleanKey = key.replace(/\\n/g, '\n').trim()
      return (
        cleanKey.includes('-----BEGIN PRIVATE KEY-----') &&
        cleanKey.includes('-----END PRIVATE KEY-----') &&
        cleanKey.length > 100 // Basic length validation
      )
    }

    privateKey = privateKey
  .replace(/\\n/g, '\n') // Ganti \n dengan newline
  .replace(/\n+/g, '\n') // Hapus baris kosong tambahan
  .trim();

// Tambahkan header dan footer jika hilang
if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
  privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
}

    // Validate the private key
    if (!isValidPrivateKey(privateKey)) {
      console.error('Invalid private key format')
      return {
        success: false,
        error: 'Invalid or incomplete private key configuration'
      }
    }

    console.log('Private key validation passed')
    
    const targetAudience = 'https://oauth2.googleapis.com/token'
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + 3600
    
    const payload = {
      iss: googleClientEmail,
      sub: googleClientEmail,
      aud: targetAudience,
      iat: iat,
      exp: exp,
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    }

    try {
      const signedJwt = jwt.sign(payload, privateKey, { 
        algorithm: 'RS256',
        header: {
          alg: 'RS256',
          typ: 'JWT'
        }
      })
      
      console.log('JWT token generated successfully')
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: signedJwt,
        }).toString()
      })
      
      const responseText = await response.text()
      let responseData
      
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse response:', responseText)
        return {
          success: false,
          error: 'Invalid response from Google OAuth'
        }
      }
      
      if (!response.ok) {
        console.error('OAuth error:', responseData)
        return {
          success: false,
          error: `OAuth error: ${responseData.error || response.status}`
        }
      }
      
      return {
        success: true,
        accessToken: responseData.access_token,
        expiresIn: responseData.expires_in
      }
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError)
      return {
        success: false,
        error: `JWT signing failed: ${jwtError.message}`
      }
    }
  } catch (error) {
    console.error('Error in token generation:', error)
    return {
      success: false,
      error: `Server error: ${error.message}`
    }
  }
})