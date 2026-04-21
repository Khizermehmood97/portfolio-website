import type { BlogPost } from '@/types'

// Load all markdown files as raw strings at bundle time via Vite glob import
const modules = import.meta.glob('../posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/**
 * Minimal frontmatter parser — handles the string and string-array values
 * used in our post files. No Node.js dependencies.
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { data: {}, content: raw }

  const yaml = match[1] ?? ''
  const content = (match[2] ?? '').trimStart()
  const data: Record<string, unknown> = {}

  const lines = yaml.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i] ?? ''
    const colonIdx = line.indexOf(':')
    if (colonIdx < 0) { i++; continue }

    const key = line.slice(0, colonIdx).trim()
    const rest = line.slice(colonIdx + 1).trim()

    if (rest.startsWith('[')) {
      // Inline array: ["AI", "GPT-4"] or [AI, GPT-4]
      const inner = rest.slice(1, rest.lastIndexOf(']'))
      data[key] = inner
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
      i++
    } else if (rest === '') {
      // Block sequence:
      //   tags:
      //     - AI
      //     - Azure
      i++
      const items: string[] = []
      while (i < lines.length && /^\s*-\s/.test(lines[i] ?? '')) {
        items.push((lines[i] ?? '').replace(/^\s*-\s*/, '').replace(/^["']|["']$/g, ''))
        i++
      }
      data[key] = items
    } else {
      // Plain scalar — strip surrounding quotes
      data[key] = rest.replace(/^["']|["']$/g, '')
      i++
    }
  }

  return { data, content }
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(modules)
    .map(([filepath, raw]) => {
      const slug = filepath.replace('../posts/', '').replace('.md', '')
      const { data, content } = parseFrontmatter(raw)
      return {
        slug,
        title: (data['title'] as string) ?? slug,
        date: (data['date'] as string) ?? '',
        excerpt: (data['excerpt'] as string) ?? '',
        tags: (data['tags'] as string[]) ?? [],
        cover: (data['cover'] as string) || undefined,
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}
