import { useEffect } from 'react'
import { headTags, SEO_ATTR } from './head'
import type { PageSeo } from './pages'

/**
 * Sets the page's title, description, canonical link, social card and structured data.
 * Call it once at the top of each page: useSeo(pageSeo('/about')), useSeo(productSeo(p)), useSeo(articleSeo(post)).
 *
 * During a page change both the old and new page are mounted for a moment (PageTransition);
 * the new page's effect runs last, so its tags win.
 */
export function useSeo(seo: PageSeo) {
  const tags = headTags(seo)
  const key = JSON.stringify(tags)

  useEffect(() => {
    const head = document.head
    head.querySelectorAll(`[${SEO_ATTR}]`).forEach((el) => el.remove())
    for (const t of tags) {
      if (t.tag === 'title') {
        document.title = t.text
        continue
      }
      const el = document.createElement(t.tag)
      for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v)
      el.setAttribute(SEO_ATTR, '')
      if (t.tag === 'script') el.textContent = t.text
      head.appendChild(el)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tags are rebuilt every render; key captures their content
  }, [key])
}
