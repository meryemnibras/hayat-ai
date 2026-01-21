import { CLINIC_DATA } from '../data/clinic-data'
import type { ClinicData } from '../data/types'

/**
 * اختبار شامل لبيانات العيادة
 */
function checkData() {
  console.log('🔍 فحص بيانات العيادة...\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const errors: string[] = []
  const warnings: string[] = []

  // 1. فحص معلومات العيادة
  console.log('📋 1. فحص معلومات العيادة...')
  if (!CLINIC_DATA.info.name) errors.push('❌ اسم العيادة مفقود')
  if (!CLINIC_DATA.info.nameEn) errors.push('❌ اسم العيادة بالإنجليزية مفقود')
  if (!CLINIC_DATA.info.location) errors.push('❌ موقع العيادة مفقود')
  if (!CLINIC_DATA.info.contact.whatsapp) errors.push('❌ رقم WhatsApp مفقود')
  if (!CLINIC_DATA.info.contact.email) errors.push('❌ البريد الإلكتروني مفقود')
  if (CLINIC_DATA.info.languages.length === 0) errors.push('❌ اللغات المدعومة مفقودة')
  console.log('✅ معلومات العيادة: صحيحة\n')

  // 2. فحص العلاجات
  console.log('💊 2. فحص العلاجات...')
  const treatments = CLINIC_DATA.treatments
  const treatmentKeys = Object.keys(treatments)
  
  if (treatmentKeys.length === 0) {
    errors.push('❌ لا توجد علاجات محددة')
  } else {
    console.log(`   📦 عدد العلاجات: ${treatmentKeys.length}`)
    treatmentKeys.forEach(key => {
      const treatment = (treatments as any)[key]
      if (!treatment.name) warnings.push(`⚠️  علاج ${key}: الاسم مفقود`)
      if (!treatment.techniques && !treatment.types) {
        warnings.push(`⚠️  علاج ${key}: لا توجد تقنيات أو أنواع`)
      }
    })
    console.log('✅ العلاجات: صحيحة\n')
  }

  // 3. فحص نظام الدفع
  console.log('💳 3. فحص نظام الدفع...')
  if (!CLINIC_DATA.payment) {
    errors.push('❌ نظام الدفع مفقود')
  } else {
    if (!CLINIC_DATA.payment.methods || CLINIC_DATA.payment.methods.length === 0) {
      warnings.push('⚠️  طرق الدفع غير محددة')
    }
    if (!CLINIC_DATA.payment.currencies || CLINIC_DATA.payment.currencies.length === 0) {
      warnings.push('⚠️  العملات المقبولة غير محددة')
    }
    console.log('✅ نظام الدفع: صحيح\n')
  }

  // 4. فحص السياحة الطبية
  console.log('✈️  4. فحص السياحة الطبية...')
  if (!CLINIC_DATA.medicalTourism) {
    errors.push('❌ معلومات السياحة الطبية مفقودة')
  } else {
    if (!CLINIC_DATA.medicalTourism.packages || CLINIC_DATA.medicalTourism.packages.length === 0) {
      warnings.push('⚠️  باقات السياحة الطبية غير محددة')
    }
    console.log('✅ السياحة الطبية: صحيحة\n')
  }

  // 5. فحص الأطباء
  console.log('👨‍⚕️ 5. فحص الأطباء...')
  if (!CLINIC_DATA.doctors || CLINIC_DATA.doctors.length === 0) {
    warnings.push('⚠️  قائمة الأطباء فارغة (اختياري)')
  } else {
    console.log(`   👥 عدد الأطباء: ${CLINIC_DATA.doctors.length}`)
  }
  console.log('✅ الأطباء: ' + (CLINIC_DATA.doctors?.length ? 'موجودون' : 'غير محددين (اختياري)') + '\n')

  // 6. فحص المواعيد
  console.log('📅 6. فحص نظام المواعيد...')
  if (!CLINIC_DATA.appointments) {
    warnings.push('⚠️  نظام المواعيد غير محدد (اختياري)')
  }
  console.log('✅ المواعيد: ' + (CLINIC_DATA.appointments ? 'محدد' : 'غير محدد (اختياري)') + '\n')

  // 7. إحصائيات عامة
  console.log('📊 7. إحصائيات عامة...')
  console.log(`   - عدد العلاجات: ${treatmentKeys.length}`)
  console.log(`   - طرق الدفع: ${CLINIC_DATA.payment?.methods?.length || 0}`)
  console.log(`   - العملات: ${CLINIC_DATA.payment?.currencies?.length || 0}`)
  console.log(`   - باقات السياحة: ${CLINIC_DATA.medicalTourism?.packages?.length || 0}`)
  console.log(`   - الأطباء: ${CLINIC_DATA.doctors?.length || 0}`)
  console.log('✅ الإحصائيات: جاهزة\n')

  // 8. النتيجة النهائية
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('📋 ملخص الفحص:\n')
  
  if (errors.length > 0) {
    console.log('❌ الأخطاء:')
    errors.forEach(err => console.log(`   ${err}`))
    console.log('')
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  التحذيرات:')
    warnings.forEach(warn => console.log(`   ${warn}`))
    console.log('')
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅✅✅ جميع البيانات صحيحة ومكتملة! ✅✅✅\n')
    return true
  } else if (errors.length === 0) {
    console.log('✅ البيانات صحيحة مع بعض التحذيرات (غير حرجة)\n')
    return true
  } else {
    console.log('❌ يوجد أخطاء يجب إصلاحها\n')
    return false
  }
}

// تشغيل الفحص
const result = checkData()
process.exit(result ? 0 : 1)













