export const themeColors = {
  brandGradient: 'bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900',
  brandLogoGradient: 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-slate-800',
  softInfoPanel:
    'bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/40 dark:to-sky-950/40 border-indigo-100 dark:border-indigo-900/40',
  highlight: 'bg-amber-200 dark:bg-amber-800 text-gray-900 dark:text-white',
};

export const statusBadge = {
  primary:
    'inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800',
  info:
    'inline-flex items-center rounded-full bg-sky-50 dark:bg-sky-950/70 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-sky-800',
  success:
    'inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800',
  warning:
    'inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800',
  danger:
    'inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/70 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800',
  neutral:
    'inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
};

export const compactBadge = {
  primary:
    'rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800',
  info:
    'rounded-md bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-sky-800',
  success:
    'rounded-md bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800',
  warning:
    'rounded-md bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800',
  danger:
    'rounded-md bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800',
  neutral:
    'rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
};

export const stateText = {
  primary: 'text-indigo-600 dark:text-indigo-400',
  info: 'text-sky-600 dark:text-sky-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-rose-600 dark:text-rose-400',
  neutral: 'text-gray-500 dark:text-gray-400',
};

export const stateFill = {
  primary: 'bg-indigo-500',
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  neutral: 'bg-gray-300 dark:bg-gray-700',
};

const actionBase =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';

export const actionButton = {
  primary: `${actionBase} bg-indigo-600 px-3 text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 focus-visible:ring-indigo-500/30`,
  secondary: `${actionBase} border border-gray-200 bg-white px-3 text-gray-700 shadow-xs hover:bg-gray-50 focus-visible:ring-indigo-500/25 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800`,
  subtle: `${actionBase} bg-gray-100 px-3 text-gray-700 hover:bg-gray-200 focus-visible:ring-indigo-500/25 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700`,
  ghost: `${actionBase} px-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-indigo-500/25 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200`,
  warning: `${actionBase} bg-amber-500 px-3 text-white shadow-sm shadow-amber-500/20 hover:bg-amber-600 focus-visible:ring-amber-500/30`,
  warningSoft: `${actionBase} bg-amber-50 px-3 text-amber-700 hover:bg-amber-100 focus-visible:ring-amber-500/25 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/70`,
  successSoft: `${actionBase} bg-emerald-50 px-3 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-500/25 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/70`,
  infoSoft: `${actionBase} bg-sky-50 px-3 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-500/25 dark:bg-sky-950/60 dark:text-sky-300 dark:hover:bg-sky-900/70`,
  danger: `${actionBase} bg-rose-600 px-3 text-white shadow-sm shadow-rose-500/20 hover:bg-rose-700 focus-visible:ring-rose-500/30`,
  dangerSoft: `${actionBase} bg-rose-50 px-3 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-500/25 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/70`,
  icon: 'inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100 hover:text-indigo-600 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400',
  iconInfo: 'inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-sky-50 hover:text-sky-600 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/25 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:bg-sky-950/60 dark:hover:text-sky-300',
  iconSuccess: 'inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-emerald-50 hover:text-emerald-600 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/25 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300',
  iconDanger: 'inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/25 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-300',
};
