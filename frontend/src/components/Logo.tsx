interface LogoProps {
    variant?: 'hero' | 'sidebar';
}

export function Logo({ variant = 'hero' }: LogoProps) {
    if (variant === 'sidebar') {
        return (
            <div className="flex items-center gap-3">
                <svg className="h-9 w-9 shrink-0" viewBox="0 0 64 64" fill="none">
                    <path
                        d="M32 54C32 54 10 40.5 10 23.5C10 16.6 15.6 11 22.5 11C26.7 11 30.4 13.1 32 16.2C33.6 13.1 37.3 11 41.5 11C48.4 11 54 16.6 54 23.5C54 40.5 32 54 32 54Z"
                        stroke="#FFFFFF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M46 8V16M42 12H50"
                        stroke="#0E9F9E"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M14 31H23L27 23L32 38L36 28L40 31H50"
                        stroke="#0E9F9E"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <div className="leading-tight">
                    <span className="block text-sm font-bold text-white">Monitoramento</span>
                    <span className="block text-sm font-semibold text-[#0E9F9E]">Hospitalar</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center select-none">
            <svg className="mb-6 h-28 w-28" viewBox="0 0 120 120" fill="none">
                <path
                    d="M60 100C60 100 18 74 18 43C18 30.3 28.3 20 41 20C48.8 20 55.7 23.9 60 29.8C64.3 23.9 71.2 20 79 20C91.7 20 102 30.3 102 43C102 74 60 100 60 100Z"
                    stroke="#FFFFFF"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M88 12V28M80 20H96"
                    stroke="#0E9F9E"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                />
                <path
                    d="M22 58H40L47 43L56 72L64 52L71 58H98"
                    stroke="#0E9F9E"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            <h1 className="text-3xl font-extrabold tracking-wide text-white sm:text-4xl">
                MONITORAMENTO
            </h1>
            <span className="mt-1 text-2xl font-bold tracking-wider text-[#0E9F9E] sm:text-3xl">
        HOSPITALAR
      </span>

            <div className="my-5 flex w-72 items-center justify-center gap-2">
                <div className="h-[1px] flex-1 bg-[#0E9F9E]/60" />
                <svg className="h-4 w-8" viewBox="0 0 36 16" fill="none">
                    <path
                        d="M1 8H10L13 3L17 13L21 6L24 8H35"
                        stroke="#0E9F9E"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <div className="h-[1px] flex-1 bg-[#0E9F9E]/60" />
            </div>

            <p className="text-xs font-semibold tracking-[0.2em] text-slate-200 uppercase">
                TECNOLOGIA <span className="mx-1.5 text-[#0E9F9E]">•</span> CUIDADO{' '}
                <span className="mx-1.5 text-[#0E9F9E]">•</span> CONFIANÇA
            </p>
        </div>
    );
}