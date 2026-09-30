import Image from "next/image";

export function AuthHero() {
  return (
    <div className="absolute inset-0 min-h-[240px] lg:min-h-full">
      <Image
        src="/exam.avif"
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="(max-width: 1024px) 100vw, 65vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/50" />
      <div className="relative z-10 flex h-full min-h-[240px] flex-col justify-start p-6 text-white lg:min-h-svh lg:p-10 lg:pt-12">
        <h1 className="max-w-lg text-2xl font-semibold leading-tight lg:text-4xl">
          Welcome to Student Portal
        </h1>
        <p className="mt-4 max-w-xl text-sm italic leading-relaxed text-white/90 lg:text-base">
          &ldquo;Focus on learning, not the little distractions. Every exam is a
          step toward your goals—prepare with confidence through MCQ
          Analysis.&rdquo;
        </p>
      </div>
    </div>
  );
}
