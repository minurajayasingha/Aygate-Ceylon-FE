import type { ReactNode } from 'react'
import { BarDots, Button, Dots, Eyebrow, FilterChip, Icon, Logo, OptionChip, SelectField, Tag, TextArea, TextField, iconNames } from '../components/ui'
import { ProductCard, ProductCardCompact } from '../components/sections/ProductCard'
import { ServiceCard, ServiceCardMobile } from '../components/sections/ServiceCard'
import { cinnamonProducts, homeServices } from '../data/content'

const colors = [
  ['gold', '#C48C40', 'Primary actions, accents'],
  ['gold-deep', '#C37002', 'Accent text on cream'],
  ['gold-muted', '#A27435', 'Mobile eyebrows'],
  ['cream', '#FFF4E8', 'Page background'],
  ['ivory', '#FFFBED', 'Alternate sections'],
  ['ink', '#000000', 'Text'],
  ['muted', '#8E8E8E', 'Secondary links'],
  ['placeholder', '#696969', 'Field placeholder'],
]

const headings = [
  ['text-display', '64 / 65', 'Inner page hero'],
  ['text-h1', '55 / 56', 'Hero and product title'],
  ['text-h2', '50 / 50', 'Section title'],
  ['text-h2-m', '48 / 48', 'Mobile hero'],
  ['text-h3', '32 / 32', 'Card and mobile section title'],
  ['text-stat', '22 / 22', 'Stat value'],
  ['text-h4', '21 / 21', 'Mobile card title'],
  ['text-h5', '20 / 26', 'List title'],
]

const body = [
  ['text-p1', '18 / 23'], ['text-p2', '16 / 21'], ['text-p3', '15 / 19'], ['text-p4', '14 / 18'], ['text-p5', '13 / 17'],
  ['text-p6', '12 / 15'], ['text-p7', '11 / 14'], ['text-p8', '10 / 13'], ['text-p9', '8 / 10'],
]

const radii = [['control', 5], ['field', 8], ['panel', 12], ['card', 19], ['chip', 22], ['feature', 28]] as const

function Block({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="border-t border-gold/30 py-10">
      <h2 className="font-serif text-h3 font-medium">{title}</h2>
      {note && <p className="mt-2 max-w-[640px] text-p4 font-light">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-[1312px] px-4 py-12 lg:px-0">
      <Eyebrow>Aygate Ceylon</Eyebrow>
      <h1 className="mt-2 font-serif text-h1 font-medium max-lg:text-h2-m">Design System</h1>
      <p className="mt-3 max-w-[640px] text-p3 font-light">Every token and component on the site, taken from the Figma Web page. Tokens live in src/index.css, shared UI in src/components/ui and page sections in src/components/sections.</p>

      <Block title="Colours" note="Use as Tailwind classes, such as bg-gold or text-gold-deep.">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {colors.map(([name, hex, use]) => (
            <div key={name} className="rounded-panel border border-gold/30 bg-white p-3">
              <div className="h-16 rounded-field border border-black/10" style={{ background: hex }} />
              <p className="mt-2 text-p4 font-medium">{name}</p>
              <p className="text-p6 font-light">{hex} · {use}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Headings: Cormorant Garamond">
        <div className="space-y-4">
          {headings.map(([cls, size, use]) => (
            <div key={cls} className="flex flex-wrap items-baseline gap-x-6">
              <p className={`font-serif font-medium ${cls}`}>Authentic Ceylon</p>
              <p className="text-p6 font-light">{cls} · {size} · {use}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Body: DM Sans">
        <div className="space-y-3">
          {body.map(([cls, size]) => (
            <div key={cls} className="flex flex-wrap items-baseline gap-x-6">
              <p className={cls}>Pure flavour. Real origins.</p>
              <p className="text-p6 font-light">{cls} · {size}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Eyebrows">
        <div className="space-y-3">
          <Eyebrow size="xl">Size xl, inner pages</Eyebrow>
          <Eyebrow size="lg">Size lg, hero</Eyebrow>
          <Eyebrow size="md">Size md, sections</Eyebrow>
        </div>
      </Block>

      <Block title="Corner radius and shadows">
        <div className="flex flex-wrap gap-4">
          {radii.map(([name, r]) => (
            <div key={name} className="flex size-24 flex-col items-center justify-center border border-gold bg-white text-center text-p6" style={{ borderRadius: r }}>
              {name}<br />{r}px
            </div>
          ))}
          {['shadow-card', 'shadow-feature', 'shadow-soft'].map((s) => (
            <div key={s} className={`flex size-24 items-center justify-center rounded-panel bg-white text-center text-p6 ${s}`}>{s}</div>
          ))}
        </div>
      </Block>

      <Block title="Icons" note={'Use <Icon name="search" />. Icons follow the text colour.'}>
        <div className="flex flex-wrap gap-3">
          {iconNames.map((name) => (
            <div key={name} className="flex w-24 flex-col items-center gap-2 rounded-field border border-gold/30 bg-white p-3 text-center text-p7 text-gold-deep">
              <Icon name={name} size={28} />
              <span className="text-ink">{name}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Logo">
        <div className="flex flex-wrap items-center gap-6">
          <div className="rounded-panel bg-ink p-4"><Logo className="h-[55px] w-[198px]" /></div>
          <div className="rounded-panel border border-gold/30 p-4"><Logo tone="dark" className="h-[55px] w-[198px]" /></div>
        </div>
      </Block>

      <Block title="Buttons">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button arrow={false}>No arrow</Button>
          <Button variant="outline" arrow={false}>Outline</Button>
          <span className="rounded-panel bg-ink p-3"><Button variant="outline-light" arrow={false}>Outline light</Button></span>
          <Button size="md">Size md</Button>
          <Button size="sm">Size sm</Button>
          <Button size="md" arrow={false} hoverArrow className="w-[169px] !h-[45px]">Hover me</Button>
        </div>
      </Block>

      <Block title="Chips, tags and pagination">
        <div className="flex flex-wrap items-center gap-4">
          <FilterChip active className="h-[53px]">Active</FilterChip>
          <FilterChip className="h-[55px]">Default</FilterChip>
          <Tag>Quills</Tag>
          <OptionChip active>H1</OptionChip>
          <OptionChip>H2</OptionChip>
          <Dots />
          <BarDots active={2} />
        </div>
      </Block>

      <Block title="Form fields">
        <div className="grid max-w-[692px] grid-cols-2 gap-6 max-lg:grid-cols-1">
          <TextField label="Text field" placeholder="Placeholder" />
          <TextField label="Focused style" placeholder="Placeholder" highlighted />
          <SelectField label="Select" options={['Quote']} />
          <TextArea label="Text area" placeholder="Type Here" className="h-[117px]" />
        </div>
      </Block>

      <Block title="Cards">
        <div className="flex flex-wrap items-start gap-5">
          <div className="w-[312px]"><ProductCard product={cinnamonProducts[0]} framed /></div>
          <div className="w-[312px]"><ProductCard product={cinnamonProducts[1]} tags="forms" /></div>
          <div className="w-[312px]"><ProductCard product={cinnamonProducts[0]} tags="qualities" framed /></div>
          <div className="w-[181px]"><ProductCardCompact product={cinnamonProducts[1]} /></div>
          <div className="w-[423px] max-w-full"><ServiceCard service={homeServices[0]} /></div>
          <ServiceCardMobile service={homeServices[1]} />
        </div>
      </Block>
    </main>
  )
}
