import type { ReactNode } from 'react'
import { useId } from 'react'
import { Icon } from './Icon'

type Common = {
  label: string
  name?: string
  highlighted?: boolean
  glass?: boolean
  labelClassName?: string
  className?: string
}

const control = (highlighted?: boolean, glass?: boolean) =>
  `block w-full rounded-field border text-[13px] leading-[16.7px] font-light outline-none text-ink placeholder:text-placeholder focus:border-gold ${
    highlighted ? 'border-gold' : glass ? 'border-white/40' : 'border-transparent'
  } ${glass ? 'bg-field-glass backdrop-blur-sm placeholder:text-muted' : 'bg-field'}`

function Label({ id, label, className = '', children }: { id: string; label: string; className?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={`mb-[7px] block pl-[21px] text-[15px] leading-[19.3px] font-light max-lg:mb-[7px] max-lg:pl-2 max-lg:text-[12px] max-lg:leading-[15.4px] ${className}`}>
        {label}
      </label>
      {children}
    </div>
  )
}

export function TextField({ label, name, placeholder, type = 'text', highlighted, glass, labelClassName, className = '' }: Common & { placeholder?: string; type?: string }) {
  const id = useId()
  return (
    <Label id={id} label={label} className={labelClassName}>
      <input id={id} name={name ?? label} type={type} placeholder={placeholder} className={`${control(highlighted, glass)} h-[45px] px-[21px] ${className}`} />
    </Label>
  )
}

export function TextArea({ label, name, placeholder, highlighted, glass, labelClassName, className = '' }: Common & { placeholder?: string }) {
  const id = useId()
  return (
    <Label id={id} label={label} className={labelClassName}>
      <textarea id={id} name={name ?? label} placeholder={placeholder} className={`${control(highlighted, glass)} resize-none px-[18px] py-[13px] ${className}`} />
    </Label>
  )
}

export function SelectField({ label, name, options, highlighted, glass, labelClassName, className = '', center }: Common & { options: string[]; center?: boolean }) {
  const id = useId()
  return (
    <Label id={id} label={label} className={labelClassName}>
      <div className="relative">
        <select id={id} name={name ?? label} className={`${control(highlighted, glass)} h-[45px] appearance-none pr-10 text-placeholder ${center ? 'pl-[40px]' : 'pl-[21px]'} ${className}`}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <Icon name="chevron-down" size={16} className="pointer-events-none absolute top-[15px] right-[16px] text-[#c2c2c2]" />
      </div>
    </Label>
  )
}
