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
            <svg className="mb-2 h-40 w-44" viewBox="0 0 132 116" fill="none">
                <defs>
                    <linearGradient id="pulseGrad" x1="60" y1="36" x2="60" y2="76" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#10B2A8" />
                        <stop offset="100%" stopColor="#1B6682" />
                    </linearGradient>
                </defs>

                {/* Arco superior esquerdo do coração (interrompido antes do pulso e antes do +) */}
                <path
                    d="M21 51C18.5 46.5 17 41.5 17 36C17 22.7 27.7 12 41 12C49.5 12 57 16.4 61 23.2C64.5 17.2 70.8 13 78.2 12.2"
                    stroke="#FFFFFF"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Arco inferior e direito do coração (da abertura do pulso até abaixo do +) */}
                <path
                    d="M28.5 62.5C40 77.5 61 93 61 93C61 93 105 64 105 36C105 34.2 104.8 32.5 104.4 30.8"
                    stroke="#FFFFFF"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Sinal de + no canto superior direito */}
                <path
                    d="M96 8V24M88 16H104"
                    stroke="#0E9F9E"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                />

                {/* Linha de batimento interna com degradê */}
                <path
                    d="M22 57H41L47.5 39L55.5 72L62.5 49L68 57H81"
                    stroke="url(#pulseGrad)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            <h1 className="text-3xl leading-none font-extrabold tracking-wide text-white sm:text-4xl">
                MONITORAMENTO
            </h1>
            <span className="mt-1.5 text-2xl leading-none font-extrabold tracking-wider text-[#0E9F9E] sm:text-3xl">
                HOSPITALAR
            </span>

            {/* Linha divisória fina com pulso central */}
            <div className="my-4 flex w-80 items-center justify-center">
                <div className="h-[1px] flex-1 bg-[#0E9F9E]/50" />
                <svg className="h-5 w-11 shrink-0" viewBox="0 0 44 20" fill="none">
                    <path
                        d="M0 10H13L16.5 3L21 17L25 6L28 10H44"
                        stroke="#0E9F9E"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <div className="h-[1px] flex-1 bg-[#0E9F9E]/50" />
            </div>

            <p className="text-xs font-bold tracking-[0.12em] text-white uppercase">
                TECNOLOGIA <span className="mx-1.5 text-white">•</span> CUIDADO{' '}
                <span className="mx-1.5 text-white">•</span> CONFIANÇA
            </p>
        </div>
    );
}