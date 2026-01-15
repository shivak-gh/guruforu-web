import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

// Cache for secrets to avoid repeated API calls
const secretCache: Map<string, { value: string; timestamp: number }> = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

/**
 * Get a secret from Google Secret Manager
 * @param secretName The name of the secret (e.g., 'BREVO_API_KEY')
 * @param projectId The GCP project ID (optional, defaults to GOOGLE_CLOUD_PROJECT env var)
 * @returns The secret value as a string
 */
export async function getSecret(
  secretName: string,
  projectId?: string
): Promise<string | null> {
  // Check cache first
  const cached = secretCache.get(secretName)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value
  }

  try {
    const client = new SecretManagerServiceClient()
    const project = projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID

    if (!project) {
      console.warn(`⚠️ GCP Project ID is not set. Cannot fetch ${secretName} from Secret Manager.`)
      console.warn('   Set GOOGLE_CLOUD_PROJECT or GCP_PROJECT_ID environment variable.')
      console.warn('   For local development: gcloud config set project YOUR_PROJECT_ID')
      return null
    }

    // Format: projects/{project}/secrets/{secret}/versions/latest
    const name = `projects/${project}/secrets/${secretName}/versions/latest`

    console.log(`🔍 Fetching ${secretName} from Google Secret Manager (project: ${project})...`)
    const [version] = await client.accessSecretVersion({ name })

    if (!version.payload || !version.payload.data) {
      console.error(`❌ Secret ${secretName} not found or has no data in project ${project}`)
      return null
    }

    // Decode the secret value (data can be Buffer or string)
    const secretData = version.payload.data
    const secretValue = typeof secretData === 'string' 
      ? secretData 
      : Buffer.from(secretData).toString('utf8')

    // Update cache
    secretCache.set(secretName, {
      value: secretValue,
      timestamp: Date.now(),
    })

    console.log(`✅ Successfully fetched ${secretName} from Google Secret Manager`)
    return secretValue
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error'
    console.error(`❌ Error fetching secret ${secretName} from Secret Manager:`, errorMessage)
    
    // Provide helpful error messages for common issues
    if (errorMessage.includes('authentication') || errorMessage.includes('credentials')) {
      console.error('   💡 For local development, authenticate with:')
      console.error('      gcloud auth application-default login')
    }
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      console.error(`   💡 Secret ${secretName} may not exist in project. Create it with:`)
      console.error(`      gcloud secrets create ${secretName} --data-file=- --project=${process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID || 'YOUR_PROJECT_ID'}`)
    }
    
    // Fallback to environment variable if Secret Manager fails (works in both dev and production)
    const envKey = secretName.replace(/-/g, '_')
    const envValue = process.env[envKey]
    if (envValue) {
      console.warn(`⚠️ Using environment variable ${envKey} as fallback (Secret Manager unavailable)`)
      // Cache the env var value as well
      secretCache.set(secretName, {
        value: envValue,
        timestamp: Date.now(),
      })
      return envValue
    }
    
    console.error(`Secret ${secretName} not found in Secret Manager or environment variables`)
    return null
  }
}

/**
 * Clear the secret cache (useful for testing or forced refresh)
 */
export function clearSecretCache(): void {
  secretCache.clear()
}
