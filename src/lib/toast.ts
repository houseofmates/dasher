import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const { subscribe, update } = writable<Toast[]>([]);

export const toasts = {
  subscribe,
  add: (message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    update(all => [{ id, message, type, duration }, ...all]);
    if (duration > 0) {
      setTimeout(() => toasts.remove(id), duration);
    }
    return id;
  },
  remove: (id: string) => {
    update(all => all.filter(t => t.id !== id));
  },
  success: (msg: string) => toasts.add(msg, 'success'),
  error: (msg: string) => toasts.add(msg, 'error'),
  info: (msg: string) => toasts.add(msg, 'info'),
  warning: (msg: string) => toasts.add(msg, 'warning'),
};
