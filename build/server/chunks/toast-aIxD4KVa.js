import { w as writable } from './index-server-C4D8vfaK.js';

//#region src/lib/toast.ts
var { subscribe, update } = writable([]);
var toasts = {
	subscribe,
	add: (message, type = "info", duration = 4e3) => {
		const id = Math.random().toString(36).substring(2, 9);
		update((all) => [{
			id,
			message,
			type,
			duration
		}, ...all]);
		if (duration > 0) setTimeout(() => toasts.remove(id), duration);
		return id;
	},
	remove: (id) => {
		update((all) => all.filter((t) => t.id !== id));
	},
	success: (msg) => toasts.add(msg, "success"),
	error: (msg) => toasts.add(msg, "error"),
	info: (msg) => toasts.add(msg, "info"),
	warning: (msg) => toasts.add(msg, "warning")
};

export { toasts as t };
//# sourceMappingURL=toast-aIxD4KVa.js.map
