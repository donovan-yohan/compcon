type ItemID = { id: string }

declare interface LicenseReq { name: string, rank: number, items: string[], missing?: any }

declare interface IColor {
  [key: string]: string
  light: string
  dark: string
}

declare interface IRules {
  base_structure: number
  base_stress: number
  base_grapple: number
  base_ram: number
  base_pilot_hp: number
  base_pilot_evasion: number
  base_pilot_edef: number
  base_pilot_speed: number,
  minimum_pilot_skills: number,
  max_pilot_weapons: number
  max_pilot_armor: number
  max_pilot_gear: number
  mount_fittings: {
    [key: string]: string[]
    auxiliary: string[]
    main: string[]
    flex: string[]
    heavy: string[]
  }
}