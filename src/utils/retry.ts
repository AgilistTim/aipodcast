export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delay: number
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      lastError = error;

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}