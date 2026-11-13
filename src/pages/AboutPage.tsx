import { founder } from '../data/content'
import { Button, Eyebrow, Icon, SlideIn, TypedHeading } from '../components/ui'
import { Hero } from '../components/sections/Hero'
import { pageSeo, useSeo } from '../seo'

const peopleNote = 'Founder cards should use real photos, names, roles, short professional bios, LinkedIn and each person’s responsibility.'

const story = [
  'Aygate Ceylon began with two friends who shared an interest in Sri Lanka’s agricultural products and a belief that good local products could reach a wider international market with the right care and presentation.',
  'The vision grew from farming and working with selected spices and tea toward adding value through better product selection, practical processing and packaging options, and products prepared with international buyers in mind.',
]

// Figma updated this paragraph on desktop only.
const storyLast = {
  desktop: 'Today, our focus is on selected Sri Lankan products such as Ceylon true cinnamon, Ceylon pepper and Ceylon tea, connecting local sourcing with the requirements of importers, distributors, manufacturers and brands.',
  mobile: 'Today, our focus is on selected Sri Lankan products such as Ceylon cinnamon, pepper and tea, connecting local sourcing with the requirements of importers, distributors, manufacturers and brands.',
}

export function AboutPage() {
  useSeo(pageSeo('/about'))
  return (
    <>
      <Hero
        image="hero-about"
        eyebrow="ABOUT AYGATE CEYLON"
        title="A Sri Lankan Business Built Around Products We Believe In"
        body="From two friends with an interest in farming to a growing ambition to take Sri Lankan products to international buyers."
        titleWidth={820}
        bodyWidth={476}
        desktop={{ height: 481, eyebrow: [67, 243], title: [59, 270], body: [64, 416] }}
        mobile={{ height: 495, eyebrow: [20, 184], title: [20, 209], body: [21, 401] }}
      />

      <section className="relative mx-auto max-w-[1440px] lg:h-[1265px] max-lg:h-[1392px]">
        <SlideIn from="right" kind="media" className="absolute top-[40px] left-[723px] h-[534px] w-[650px] max-lg:top-[129px] max-lg:left-0 max-lg:h-[418px] max-lg:w-full">
          <img src="/images/about-story.webp" alt="A farmer overlooking tea fields at sunrise" loading="lazy" className="size-full rounded-panel object-cover max-lg:rounded-none" />
        </SlideIn>
        <div className="absolute top-[92px] left-[65px] max-lg:top-[29px] max-lg:left-[18px]">
          <SlideIn><Eyebrow>OUR STORY</Eyebrow></SlideIn>
          <TypedHeading className="mt-[4px] -ml-px font-serif text-h2 font-medium max-lg:mt-[6px] max-lg:ml-0 max-lg:text-h3">Local products.<br />International ambition.</TypedHeading>
        </div>
        <div className="absolute top-[232px] left-[65px] w-[625px] space-y-[19px] text-p3 font-light max-lg:top-[565px] max-lg:left-[18px] max-lg:w-[350px] max-lg:max-w-[calc(100%-36px)] max-lg:space-y-[15px] max-lg:text-p6">
          {story.map((p, i) => <SlideIn key={p} i={2 + i}><p>{p}</p></SlideIn>)}
          <SlideIn i={4} className="max-lg:hidden"><p>{storyLast.desktop}</p></SlideIn>
          <SlideIn i={4} className="lg:hidden"><p>{storyLast.mobile}</p></SlideIn>
        </div>
        <SlideIn i={5} className="absolute top-[473px] left-[65px] max-lg:top-[805px] max-lg:left-[132px]">
          <Button to="/contact" className="w-[153px] max-lg:!h-[46px] max-lg:w-[122px] max-lg:!text-[12px]">Contact Us</Button>
        </SlideIn>

        <SlideIn className="absolute top-[633px] left-[65px] max-lg:top-[905px] max-lg:left-[18px]"><Eyebrow>PEOPLE</Eyebrow></SlideIn>
        <TypedHeading className="absolute top-[654px] left-[64px] font-serif text-h2 font-medium max-lg:top-[920px] max-lg:left-[19px] max-lg:w-[368px] max-lg:text-h3 max-lg:leading-[34.9px]">Real people<br className="lg:hidden" /> behind the brand.</TypedHeading>
        {/* Desktop: photo beside the details. */}
        <article className="max-lg:hidden">
          <SlideIn kind="media" className="absolute top-[736px] left-[65px] h-[499px] w-[587px]">
            <img src="/images/founder.webp" alt={founder.name} loading="lazy" className="size-full rounded-panel object-cover object-top" />
          </SlideIn>
          <SlideIn from="right" i={1} className="absolute top-[805px] left-[720px]"><h3 className="text-[40px] leading-[51px] whitespace-nowrap">{founder.name}</h3></SlideIn>
          <SlideIn from="right" i={2} className="absolute top-[856px] left-[720px]"><p className="text-p3">{founder.role}</p></SlideIn>
          <SlideIn from="right" i={3} className="absolute top-[945px] left-[720px] w-[400px]"><p className="text-p6">{founder.bio}</p></SlideIn>
          <SlideIn from="right" i={4} className="absolute top-[1017px] left-[720px] flex gap-[10px]">
            <a href="#" aria-label="LinkedIn"><Icon name="linkedin-v1" size={28} /></a>
            <a href="#" aria-label="LinkedIn"><Icon name="linkedin-v1" size={28} /></a>
          </SlideIn>
        </article>

        {/* Mobile: one card with the details over a dark fade. */}
        <SlideIn from="up" kind="card" className="absolute top-[1008px] left-[83px] lg:hidden">
        <article className="relative h-[352px] w-[237px] overflow-hidden rounded-panel text-white">
          <img src="/images/founder.webp" alt={founder.name} loading="lazy" className="absolute inset-0 size-full object-cover" />
          <span className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50.76%,#000_86.88%)] opacity-90" />
          <h3 className="absolute top-[187px] left-[24px] font-serif text-h4 font-semibold">{founder.nameMobile}</h3>
          <p className="absolute top-[213px] left-[25px] text-p8 font-light">{founder.roleMobile}</p>
          <p className="absolute top-[239px] left-[25px] w-[177px] text-p8">{founder.bio}</p>
          <div className="absolute top-[310px] left-[25px] flex gap-[9px]">
            <a href="#" aria-label="LinkedIn"><Icon name="linkedin-v1" size={26} /></a>
            <a href="#" aria-label="LinkedIn"><Icon name="linkedin-v1" size={26} /></a>
          </div>
        </article>
        </SlideIn>
      </section>

      <section className="relative overflow-hidden shadow-soft lg:h-[594px] max-lg:h-[894px]">
        <img src="/images/bg-leaf-594.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover max-lg:hidden" />
        <img src="/images/bg-leaf-m-894.webp" alt="" loading="lazy" className="absolute inset-0 size-full object-cover lg:hidden" />
        <div className="relative mx-auto max-w-[1440px]">
          <SlideIn className="absolute top-[60px] left-[65px] max-lg:top-[21px] max-lg:left-[18px]"><Eyebrow>PEOPLE</Eyebrow></SlideIn>
          <TypedHeading className="absolute top-[81px] left-[64px] font-serif text-h2 font-medium whitespace-nowrap max-lg:top-[38px] max-lg:left-[19px] max-lg:text-h3">Where Sri Lankan <br className="lg:hidden" />Quality Comes to Life</TypedHeading>
          <SlideIn i={1} className="absolute top-[138px] left-[65px] w-[800px] max-lg:top-[112px] max-lg:left-[18px] max-lg:w-[350px] max-lg:max-w-[calc(100%-36px)]"><p className="text-p4 max-lg:text-p8">{peopleNote}</p></SlideIn>
          <SlideIn i={2} kind="media" className="absolute top-[199px] left-[65px] h-[328px] w-[647px] max-lg:top-[163px] max-lg:left-0 max-lg:h-[418px] max-lg:w-full">
            <img src="/images/gallery-main.webp" alt="A woman sorting cinnamon quills" loading="lazy" className="size-full rounded-panel object-cover max-lg:rounded-none" />
          </SlideIn>
          {[
            ['gallery-1', 'top-[199px] left-[725px] max-lg:top-[591px] max-lg:left-0'],
            ['gallery-2', 'top-[199px] left-[1057px] max-lg:top-[591px] max-lg:left-[calc(50%+5px)]'],
            ['gallery-3', 'top-[368px] left-[725px] max-lg:top-[730px] max-lg:left-0'],
            ['service-packing', 'top-[368px] left-[1057px] max-lg:top-[730px] max-lg:left-[calc(50%+5px)]'],
          ].map(([img, pos], i) => (
            <SlideIn key={img} from="right" i={3 + i} kind="media" className={`absolute h-[159px] w-[319px] max-lg:h-[129px] max-lg:w-[calc(50%-5px)] ${pos}`}>
              <img src={`/images/${img}.webp`} alt="" loading="lazy" className="size-full rounded-panel object-cover max-lg:rounded-none" />
            </SlideIn>
          ))}
        </div>
      </section>
    </>
  )
}
