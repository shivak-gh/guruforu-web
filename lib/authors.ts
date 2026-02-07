/**
 * Author profiles for EEAT (Experience, Expertise, Authoritativeness, Trustworthiness).
 * Reference by id in blog content: "author": "guruforu-editorial"
 */

export interface Author {
  id: string
  name: string
  role: string
  bio: string
  url?: string
  image?: string
}

export const authors: Record<string, Author> = {
  'guruforu-editorial': {
    id: 'guruforu-editorial',
    name: 'GuruForU Editorial Team',
    role: 'Education & Curriculum',
    bio: 'Our editorial team includes experienced educators and curriculum specialists who create evidence-based content to help parents and students succeed with online learning.',
    url: 'https://www.guruforu.com/about',
  },
}

export const defaultAuthorId = 'guruforu-editorial'

export function getAuthor(id: string | undefined): Author {
  if (id && authors[id]) return authors[id]
  return authors[defaultAuthorId]
}
