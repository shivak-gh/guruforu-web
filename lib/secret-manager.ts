import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

// Singleton client and caches to reduce Secret Manager API traffic.
const client = new SecretManagerServiceClient()
const secretCache: Map<string, { value: string; timestamp: number }> = new Map()
const failedFetchCache: Map<string, number> = new Map()
const inFlightRequests: Map<string, Promise<string | null>> = new Map()

// Default to 1 hour; can override with SECRET_CACHE_TTL_MS.
const CACHE_TTL = Number(process.env.SECRET_CACHE_TTL_MS || 60 * 60 * 1000)
// Avoid hammering Secret Manager on repeated failures.
const FAILED_FETCH_RETRY_MS = Number(process.env.SECRET_FAILED_RETRY_MS || 60 * 1000)

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
  const project = projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID
  const cacheKey = `${project || 'no-project'}:${secretName}`
  const now = Date.now()

  // Check success cache first.
  const cached = secretCache.get(cacheKey)
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.value
  }

  // Back off briefly after failed fetches to avoid repeated expensive failures.
  const failedAt = failedFetchCache.get(cacheKey)
  if (failedAt && now - failedAt < FAILED_FETCH_RETRY_MS) {
    return null
  }

  // De-duplicate concurrent requests for the same secret.
  const inFlight = inFlightRequests.get(cacheKey)
  if (inFlight) {
    return inFlight
  }

  const fetchPromise = (async () => {
    try {
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

      // Update success cache and clear failure marker.
      secretCache.set(cacheKey, {
      value: secretValue,
        timestamp: now,
    })
      failedFetchCache.delete(cacheKey)

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
        secretCache.set(cacheKey, {
          value: envValue,
          timestamp: now,
        })
        failedFetchCache.delete(cacheKey)
        return envValue
      }
    
      // Mark failure to avoid immediate retries.
      failedFetchCache.set(cacheKey, Date.now())
      console.error(`Secret ${secretName} not found in Secret Manager or environment variables`)
      return null
    } finally {
      inFlightRequests.delete(cacheKey)
    }
  })()

  inFlightRequests.set(cacheKey, fetchPromise)
  return fetchPromise
}

/**
 * Clear the secret cache (useful for testing or forced refresh)
 */
export function clearSecretCache(): void {
  secretCache.clear()
  failedFetchCache.clear()
  inFlightRequests.clear()
}
