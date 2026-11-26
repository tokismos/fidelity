// Days between two spins in the same store. The database checks it too (spin_wheel).
export const WHEEL_SPIN_DAYS = 3

// Slices needed before customers see the wheel
export const WHEEL_MIN_SLICES = 2

// How long the wheel turns before it stops on the prize
export const WHEEL_SPIN_MS = 4500

// Most slices on one wheel. The database checks it too (check_wheel_slice_count).
export const WHEEL_MAX_SLICES = 8
