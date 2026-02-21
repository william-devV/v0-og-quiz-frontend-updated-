"use client"

interface AnimatedBackgroundProps {
  variant?: "light" | "dark"
  children: React.ReactNode
}

export function AnimatedBackground({ variant = "light", children }: AnimatedBackgroundProps) {
  const isDark = variant === "dark"

  return (
    <div className={`relative min-h-[100dvh] overflow-hidden ${isDark ? "bg-navy-warm" : "bg-texture-warm"}`}>
      {/* Floating orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className={`animate-float-slow absolute top-[10%] left-[8%] h-40 w-40 rounded-full blur-3xl ${
            isDark ? "bg-arb-blue/10" : "bg-arb-blue/8"
          }`}
        />
        <div
          className={`animate-float-medium absolute top-[60%] right-[10%] h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-arb-blue/6" : "bg-navy/4"
          }`}
          style={{ animationDelay: "-2s" }}
        />
        <div
          className={`animate-float-fast absolute bottom-[15%] left-[20%] h-32 w-32 rounded-full blur-2xl ${
            isDark ? "bg-arb-blue/6" : "bg-arb-blue/5"
          }`}
          style={{ animationDelay: "-4s" }}
        />
        <div
          className={`animate-float-medium absolute top-[30%] right-[25%] h-24 w-24 rounded-full blur-2xl ${
            isDark ? "bg-arb-blue/5" : "bg-navy/3"
          }`}
          style={{ animationDelay: "-1s" }}
        />
        {/* Extra warm accent orb */}
        <div
          className={`animate-float-slow absolute top-[45%] left-[50%] h-64 w-64 rounded-full blur-3xl ${
            isDark ? "bg-arb-blue/4" : "bg-arb-blue/4"
          }`}
          style={{ animationDelay: "-3s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
