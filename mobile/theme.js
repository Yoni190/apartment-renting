export const colors = {
  primary: '#1a73e8',
  primaryDark: '#1557b0',
  primaryLight: '#e8f0fe',
  surface: '#ffffff',
  background: '#f4f6f9',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  accent: '#f59e0b',
  success: '#10b981',
  successLight: '#d1fae5',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  border: '#e5e7eb',
  navBg: '#0f172a',
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.4)',
  statusPending: '#fef3c7',
  statusPendingText: '#92400e',
  statusPrimary: '#e0f2fe',
  statusSuccess: '#f0fdfa',
  statusSuccessBorder: '#ccfbf1',
  teal: '#0ea5a4',
  borderLight: '#eef2f6',
  heartActive: '#e0245e',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
  h2: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  h3: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  h4: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 16, fontWeight: '400', color: colors.textPrimary },
  bodySmall: { fontSize: 14, fontWeight: '400', color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '700', color: colors.white },
};
