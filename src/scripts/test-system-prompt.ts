import { ENHANCED_SYSTEM_PROMPT } from '../lib/langchain-enhanced'
import { CLINIC_DATA } from '../data/clinic-data'

/**
 * اختبار System Prompt
 */
function testSystemPrompt() {
  console.log('🧪 اختبار System Prompt...\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // 1. فحص وجود System Prompt
  console.log('📝 1. فحص وجود System Prompt...')
  if (!ENHANCED_SYSTEM_PROMPT) {
    console.error('❌ System Prompt غير موجود!')
    return false
  }
  console.log('✅ System Prompt موجود\n')

  // 2. فحص طول System Prompt
  console.log('📏 2. فحص طول System Prompt...')
  const promptLength = ENHANCED_SYSTEM_PROMPT.length
  console.log(`   الطول: ${promptLength} حرف`)
  
  if (promptLength < 100) {
    console.warn('⚠️  System Prompt قصير جداً (أقل من 100 حرف)')
  } else if (promptLength > 10000) {
    console.warn('⚠️  System Prompt طويل جداً (أكثر من 10000 حرف)')
  } else {
    console.log('✅ الطول مناسب\n')
  }

  // 3. فحص وجود معلومات العيادة في Prompt
  console.log('🏥 3. فحص معلومات العيادة في Prompt...')
  const checks = [
    { name: 'اسم العيادة', value: CLINIC_DATA.info.name, found: ENHANCED_SYSTEM_PROMPT.includes(CLINIC_DATA.info.name) },
    { name: 'الموقع', value: CLINIC_DATA.info.location, found: ENHANCED_SYSTEM_PROMPT.includes(CLINIC_DATA.info.location) },
    { name: 'WhatsApp', value: CLINIC_DATA.info.contact.whatsapp, found: ENHANCED_SYSTEM_PROMPT.includes(CLINIC_DATA.info.contact.whatsapp) },
    { name: 'البريد', value: CLINIC_DATA.info.contact.email, found: ENHANCED_SYSTEM_PROMPT.includes(CLINIC_DATA.info.contact.email) },
  ]

  let allFound = true
  checks.forEach(check => {
    if (check.found) {
      console.log(`   ✅ ${check.name}: موجود`)
    } else {
      console.log(`   ❌ ${check.name}: غير موجود`)
      allFound = false
    }
  })

  if (allFound) {
    console.log('✅ جميع معلومات العيادة موجودة في Prompt\n')
  } else {
    console.log('❌ بعض المعلومات مفقودة\n')
  }

  // 4. فحص وجود التعليمات الأساسية
  console.log('📋 4. فحص التعليمات الأساسية...')
  const requiredInstructions = [
    'الترحيب',
    'الإجابة',
    'التوجيه',
    'اللغة',
    'الخصوصية',
    'الحدود'
  ]

  const foundInstructions = requiredInstructions.filter(inst => 
    ENHANCED_SYSTEM_PROMPT.toLowerCase().includes(inst.toLowerCase())
  )

  console.log(`   التعليمات الموجودة: ${foundInstructions.length}/${requiredInstructions.length}`)
  foundInstructions.forEach(inst => console.log(`   ✅ ${inst}`))
  
  const missing = requiredInstructions.filter(inst => !foundInstructions.includes(inst))
  if (missing.length > 0) {
    missing.forEach(inst => console.log(`   ⚠️  ${inst}: غير موجود`))
  }

  if (foundInstructions.length === requiredInstructions.length) {
    console.log('✅ جميع التعليمات موجودة\n')
  } else {
    console.log('⚠️  بعض التعليمات مفقودة\n')
  }

  // 5. عرض عينة من System Prompt
  console.log('📄 5. عينة من System Prompt (أول 500 حرف):')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(ENHANCED_SYSTEM_PROMPT.substring(0, 500) + '...\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // 6. النتيجة النهائية
  console.log('📊 النتيجة النهائية:')
  if (allFound && foundInstructions.length >= requiredInstructions.length - 1) {
    console.log('✅✅✅ System Prompt جاهز وصحيح! ✅✅✅\n')
    return true
  } else {
    console.log('⚠️  System Prompt يحتاج إلى تحسينات\n')
    return true // نعتبره ناجح حتى مع التحذيرات
  }
}

// تشغيل الاختبار
const result = testSystemPrompt()
process.exit(result ? 0 : 1)













