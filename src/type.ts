
export const PENDING = 'pending';

export const FULFILLED = 'fulfilled';

export const REJECTED = 'rejected';
// 一个Promise必须处在其中之一的状态：pending, fulfilled 或 rejected
export type status = 'pending' | 'fulfilled' | 'rejected';