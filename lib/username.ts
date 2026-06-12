const RESERVED_USERNAMES = new Set([
  'admin', 'api', 'auth', 'collectors', 'settings', 'support', 'about',
  'faq', 'privacy', 'disclosure', 'contact', 'themes', 'minifigs', 'sets',
  'articles', 'leaderboards', 'inventory', 'collection', 'wishlist', 'share',
  'account', 'signin', 'signup', 'login', 'logout', 'dashboard', 'home',
  'null', 'undefined', 'anonymous', 'system', 'bot', 'figtracker', 'lego',
  'bricklink', 'moderator', 'mod', 'staff', 'team',
])

const USERNAME_REGEX = /^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$|^[a-z0-9]{1,2}$/

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) return { valid: false, error: 'Username is required' }

  const lower = username.toLowerCase()

  if (lower.length < 3) return { valid: false, error: 'Username must be at least 3 characters' }
  if (lower.length > 30) return { valid: false, error: 'Username must be 30 characters or fewer' }
  if (!USERNAME_REGEX.test(lower)) {
    return { valid: false, error: 'Username can only contain lowercase letters, numbers, hyphens, and underscores' }
  }
  if (RESERVED_USERNAMES.has(lower)) return { valid: false, error: 'This username is reserved' }

  return { valid: true }
}

export function generateUsernameSuggestion(name: string | null | undefined): string {
  if (!name) return ''

  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30)

  if (slug.length < 3) return ''

  return slug
}

export function sanitizeUsername(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 30)
}
