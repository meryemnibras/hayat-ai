# 🔐 دليل إكمال Authentication مع Clerk

## الوضع الحالي

- ✅ `@clerk/nextjs` موجود في `package.json`
- ✅ `clerkId` موجود في User model
- ⚠️ `/api/auth/login` و `/api/auth/register` غير مكتملين (mock responses)
- ⚠️ لا يوجد ClerkProvider في التطبيق

---

## خطوات الإكمال

### 1. إعداد Clerk Dashboard

1. **إنشاء حساب Clerk:**
   - اذهب إلى https://clerk.com
   - أنشئ حساب جديد أو سجل الدخول

2. **إنشاء Application:**
   - اضغط "Create Application"
   - اختر اسم التطبيق: "Hayat AI Clinic"
   - اختر Authentication methods (Email, Phone, etc.)

3. **الحصول على API Keys:**
   - من Dashboard → API Keys
   - انسخ:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`

### 2. إضافة Environment Variables

#### على Vercel:
1. اذهب إلى Vercel Dashboard
2. Settings → Environment Variables
3. أضف:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

#### محلياً (.env.local):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. تحديث Root Layout

أضف `ClerkProvider` في `app/layout.tsx`:

```tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 4. تحديث Login API

استبدل `app/api/auth/login/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Clerk handles authentication
    // You'll need to use Clerk's sign-in methods
    // This is a simplified example - adjust based on your needs
    
    // After successful Clerk authentication, sync with database
    const clerkUser = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    if (clerkUser.data.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = clerkUser.data[0];
    
    // Find or create user in database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        email: user.emailAddresses[0]?.emailAddress || email,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || email,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        clinicId: process.env.DEFAULT_CLINIC_ID || "",
        role: "STAFF",
      },
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: dbUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName,
        role: dbUser.role,
      },
    });
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
```

### 5. تحديث Register API

استبدل `app/api/auth/register/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Create user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName: fullName.split(" ")[0],
      lastName: fullName.split(" ").slice(1).join(" ") || "",
      phoneNumber: phone ? [phone] : undefined,
    });

    // Create user in database
    const dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: email,
        fullName: fullName,
        phone: phone,
        clinicId: process.env.DEFAULT_CLINIC_ID || "",
        role: "STAFF",
      },
    });

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: dbUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName,
      },
    });
  } catch (error: any) {
    console.error("[Register] Error:", error);
    
    if (error?.errors?.[0]?.message?.includes("already exists")) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
```

### 6. حماية المسارات (Route Protection)

أضف middleware في `middleware.ts` (أو ملف منفصل):

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/pricing",
    "/portal",
    "/portal/login",
    "/portal/register",
    "/api/health",
  ],
  ignoredRoutes: [
    "/api/webhooks/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### 7. استخدام Clerk في Components

```tsx
import { useUser } from "@clerk/nextjs";

export function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
```

---

## ملاحظات مهمة

### ⚠️ Clerk vs Custom Auth

- **Clerk**: حل جاهز، يدعم OAuth، 2FA، إلخ
- **Custom Auth**: تحكم كامل، لكن يتطلب المزيد من العمل

### ✅ التوصية

استخدم Clerk للسرعة والأمان، لكن يمكنك أيضاً:
- استخدام JWT tokens مع NextAuth.js
- استخدام Supabase Auth (موجود في dependencies)

---

## البدائل

### Option 1: NextAuth.js
```bash
npm install next-auth
```

### Option 2: Supabase Auth
```bash
# موجود بالفعل في package.json
import { createClient } from '@supabase/supabase-js';
```

---

**ملاحظة:** هذا الدليل يوفر الأساس. قد تحتاج لتعديلات حسب احتياجاتك الخاصة.

















