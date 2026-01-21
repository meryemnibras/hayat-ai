// ═══════════════════════════════════════
// 1. Price Interface
// ═══════════════════════════════════════
export interface Price {
  min: number
  max: number
  currency?: 'USD' | 'EUR' | 'GBP' | 'TRY' | 'AED'
  perUnit?: string // مثل: "perTooth", "perSession", "perGraft"
  perSyringe?: boolean
  perImplant?: boolean
}

// ═══════════════════════════════════════
// 2. Contact & Clinic Info
// ═══════════════════════════════════════
export interface ContactInfo {
  whatsapp: string
  phone: string
  landline?: string
  email: string
  website: string
  address: string
}

export interface WorkingHours {
  weekdays: string
  weekend: string
  emergency?: string
}

export interface ClinicInfo {
  name: string
  nameEn: string
  nameTr: string
  location: string
  established: string
  languages: string[]
  certifications: string[]
  workingHours: WorkingHours
  contact: ContactInfo
}

// ═══════════════════════════════════════
// 3. Treatment Related
// ═══════════════════════════════════════
export interface TreatmentTechnique {
  name?: string
  nameAr?: string
  nameEn?: string
  nameTr?: string
  type?: string
  price: Price
  duration?: string
  description?: string
  advantages?: string[]
  disadvantages?: string[]
  bestFor?: string
  recoveryTime?: string
  finalResults?: string
  popular?: boolean
  lifespan?: string
  effectiveness?: string
  sessions?: number | string
  interval?: string
  grafts?: string
  anesthesia?: string
  units?: string
  effect?: string
  results?: string
  litersRemoved?: string
  note?: string
  includes?: string
  limitations?: string[]
  feel?: string
  safety?: string
  brands?: string[]
  result?: string
  uses?: string[]
  visibility?: string
  areas?: string[] | number
  discount?: string
  sections?: string[]
  notes?: string | string[]
  successRate?: string
  warranty?: string
  stability?: string
  process?: string[]
  hospital?: string
  implantTypes?: any[]
  shapes?: any[]
  placements?: string[]
  incisions?: string[]
  sizes?: string
  recovery?: any | Record<string, string>
  techniques?: any[]
  canCombine?: string
  benefits?: string[]
  removal?: string
  causes?: string[]
  treatment?: string[]
}

export interface TreatmentStage {
  stage?: string
  phase?: string
  day?: string
  timeline?: string | Record<string, string>
  timing?: string
  steps?: string[]
  instructions?: string[]
  care?: string[]
  expectations?: string[]
  milestones?: string[]
  details?: string[]
  requirements?: string[]
  process?: string[]
  notes?: string[]
  description?: string
  price?: Price
}

export interface TreatmentPackage {
  name: string
  price: number | Price
  includes?: string[]
  popular?: boolean
  discount?: string
  duration?: string
  areas?: number | string
  accommodation?: string
  notes?: string
}

export interface FAQ {
  q: string
  a: string
}

export interface TreatmentArea {
  area: string
  price: Price
  duration?: string
  litersRemoved?: string
  recovery?: string
  notes?: string | string[]
  sections?: string[]
  syringes?: string
  results?: string
  techniques?: string[]
  units?: string
  effect?: string
  anesthesia?: string
}

export interface CommonIssue {
  issue: string
  solution: string
  result: string
}

export interface Treatment {
  name: string
  nameEn: string
  nameTr: string
  category: 'hair' | 'face' | 'body' | 'dental' | 'skin' | 'intimate'
  description?: string
  price?: Price
  duration?: string
  mainIngredient?: string
  anesthesia?: string
  hospital?: string
  results?: string
  techniques?: TreatmentTechnique[]
  types?: TreatmentTechnique[]
  stages?: TreatmentStage[]
  phases?: TreatmentStage[]
  packages?: TreatmentPackage[]
  commonQuestions?: FAQ[]
  areas?: TreatmentArea[]
  commonIssues?: CommonIssue[]
  process?: TreatmentStage[]
  importantNotes?: string[]
  treatments?: any[]
  aftercare?: string[]
  contraindications?: string[]
  brands?: any[]
  sideEffects?: string[]
  recovery?: any
  timeline?: any | Record<string, string>
  operations?: any[]
  forWomen?: any[]
  forMen?: any[]
  dentalTourism?: any
  canCombine?: string
  bestFor?: string
  benefits?: string[]
  removal?: string
  causes?: string[]
  treatment?: string[]
  implantTypes?: any[]
  shapes?: any[]
  placements?: string[]
  incisions?: string[]
  sizes?: string
  [key: string]: any
}

// ═══════════════════════════════════════
// 4. Doctor
// ═══════════════════════════════════════
export interface Doctor {
  name: string
  title: string
  specialization: string[]
  experience: string
  education?: string
  languages: string[]
  certifications?: string[]
  operations?: string
}

// ═══════════════════════════════════════
// 5. Appointments
// ═══════════════════════════════════════
export interface ConsultationType {
  type: string
  duration: string
  price: number
  includes: string[]
}

export interface AppointmentSystem {
  availableSlots: Record<string, string[]>
  consultationTypes: ConsultationType[]
  bookingPolicy: {
    minAdvance: string
    cancellation: string
    lateCancellation: string
    noShow: string
  }
}

// ═══════════════════════════════════════
// 6. Payment
// ═══════════════════════════════════════
export interface InstallmentOption {
  plan: string
  duration: string
  interestRate: string
  conditions?: string
  example?: string
}

export interface DepositInfo {
  required?: boolean
  note?: string
  amount?: string
  purpose?: string
  refundable?: string
  refundPolicy?: string[]
}

export interface PaymentSystem {
  methods: string[]
  currencies: string[]
  exchangeRate?: string
  installments: {
    available: boolean
    options: InstallmentOption[] | string[]
    minAmount: number
    notes?: string[]
  }
  deposits: {
    consultation: DepositInfo | string
    surgery: DepositInfo | string
    refundable?: string
    remainingBalance?: string
  }
  receipts?: {
    provided: boolean
    types: string[]
    languages?: string[]
    forInsurance?: string
  }
  insurance?: {
    accepted: boolean
    reason?: string
    alternative?: string
    exceptions?: string[]
  }
  discounts?: {
    multipleOperations?: string
    groupBooking?: string
    seasonalOffers?: string
    loyaltyProgram?: string
  }
  priceGuarantee?: {
    guarantee?: boolean
    policy?: string
    includes?: string
    transparency?: string
  }
}

// ═══════════════════════════════════════
// 7. Medical Tourism
// ═══════════════════════════════════════
export interface MedicalTourismPackage {
  name: string
  includes: string[]
  accommodation?: string
  price: string | number
  popular?: boolean
  duration?: string
  bestFor?: string
}

export interface MedicalTourism {
  why?: string[]
  packages: MedicalTourismPackage[]
  visaAssistance: {
    available: boolean
    services: string[]
    visaTypes?: string[]
    notes?: string[]
  }
  airport?: {
    name?: string
    distance?: string
    alternatives?: string
    transportation?: string[]
  }
  accommodation?: {
    recommendations?: Array<{
      type: string
      price: string
      examples: string
    }>
    assistance?: string
  }
  transportation?: {
    inCity?: string[]
    [key: string]: any
  }
  tourism?: {
    highlights?: string[]
    duration?: string
    [key: string]: any
  }
}

// ═══════════════════════════════════════
// 8. Conversation Example
// ═══════════════════════════════════════
export interface ConversationExample {
  patient: string
  intent: string
  category?: string
  expectedInfo?: string[]
  sampleResponse: string
  variations?: string[]
  area?: string
}

export interface ConversationCategory {
  category: string
  examples: ConversationExample[]
}

// ═══════════════════════════════════════
// 9. Complete Clinic Data
// ═══════════════════════════════════════
export interface ClinicData {
  info: ClinicInfo
  treatments: Record<string, Treatment>
  appointments: AppointmentSystem
  payment: PaymentSystem
  medicalTourism: MedicalTourism
  doctors: Doctor[]
}
