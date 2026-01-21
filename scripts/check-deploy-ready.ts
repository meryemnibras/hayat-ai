#!/usr/bin/env tsx
/**
 * Script للتحقق من جاهزية المشروع للنشر على Vercel
 */

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const REQUIRED_FILES = [
  'package.json',
  'next.config.ts',
  'vercel.json',
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/globals.css',
  'tailwind.config.ts',
]

const REQUIRED_ENV_VARS = [
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'TEMPERATURE',
  'MAX_TOKENS',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_WHATSAPP_NUMBER',
  'NEXT_PUBLIC_PHONE_NUMBER',
  'NEXT_PUBLIC_EMAIL',
]

const REQUIRED_SCRIPTS = [
  'dev',
  'build',
  'start',
]

function checkFiles() {
  console.log('📁 التحقق من الملفات المطلوبة...\n')
  
  let allExist = true
  for (const file of REQUIRED_FILES) {
    const exists = existsSync(file)
    console.log(`${exists ? '✅' : '❌'} ${file}`)
    if (!exists) allExist = false
  }
  
  return allExist
}

function checkPackageJson() {
  console.log('\n📦 التحقق من package.json...\n')
  
  if (!existsSync('package.json')) {
    console.log('❌ package.json غير موجود')
    return false
  }
  
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
  
  // التحقق من Scripts
  console.log('📜 Scripts:')
  for (const script of REQUIRED_SCRIPTS) {
    const exists = pkg.scripts?.[script]
    console.log(`${exists ? '✅' : '❌'} npm run ${script}`)
  }
  
  // التحقق من Dependencies الأساسية
  console.log('\n📚 Dependencies الأساسية:')
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    '@langchain/openai',
    'next-auth',
    'zustand',
  ]
  
  for (const dep of requiredDeps) {
    const exists = pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]
    console.log(`${exists ? '✅' : '❌'} ${dep}`)
  }
  
  // التحقق من postinstall script
  const hasPostinstall = pkg.scripts?.postinstall?.includes('prisma generate')
  console.log(`\n${hasPostinstall ? '✅' : '⚠️'} postinstall script (لـ Prisma)`)
  
  return true
}

function checkVercelConfig() {
  console.log('\n⚙️  التحقق من vercel.json...\n')
  
  if (!existsSync('vercel.json')) {
    console.log('❌ vercel.json غير موجود')
    return false
  }
  
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf-8'))
  
  console.log(`✅ Framework: ${vercel.framework || 'nextjs'}`)
  console.log(`✅ Build Command: ${vercel.buildCommand || 'npm run build'}`)
  console.log(`✅ Regions: ${vercel.regions?.join(', ') || 'default'}`)
  
  return true
}

function checkEnvExample() {
  console.log('\n🔐 التحقق من .env.example...\n')
  
  if (!existsSync('.env.example')) {
    console.log('⚠️  .env.example غير موجود (اختياري لكن موصى به)')
    return true
  }
  
  const envExample = readFileSync('.env.example', 'utf-8')
  
  console.log('📋 Environment Variables في .env.example:')
  for (const envVar of REQUIRED_ENV_VARS) {
    const exists = envExample.includes(envVar)
    console.log(`${exists ? '✅' : '⚠️'} ${envVar}`)
  }
  
  return true
}

function main() {
  console.log('🚀 التحقق من جاهزية المشروع للنشر على Vercel\n')
  console.log('═'.repeat(50) + '\n')
  
  const filesOk = checkFiles()
  const pkgOk = checkPackageJson()
  const vercelOk = checkVercelConfig()
  const envOk = checkEnvExample()
  
  console.log('\n' + '═'.repeat(50))
  console.log('\n📊 النتيجة النهائية:\n')
  
  if (filesOk && pkgOk && vercelOk && envOk) {
    console.log('✅ المشروع جاهز للنشر على Vercel!')
    console.log('\n📝 الخطوات التالية:')
    console.log('   1. ربط Git Repository')
    console.log('   2. إضافة Environment Variables في Vercel')
    console.log('   3. Deploy!')
    console.log('\n📖 راجع VERCEL_DEPLOY.md للتعليمات التفصيلية')
    process.exit(0)
  } else {
    console.log('❌ المشروع غير جاهز للنشر')
    console.log('\n⚠️  يرجى إصلاح المشاكل المذكورة أعلاه')
    process.exit(1)
  }
}

main()












