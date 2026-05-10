import { X as attr, R as ensure_array_like, V as escape_html, T as attr_class, U as stringify, a3 as html } from './index-server-C4D8vfaK.js';
import { e as ChatCircleDots, A as ArrowClockwise, h as Trash, i as Check, j as CopySimple, a as X, k as Image, l as PaperPlaneRight } from './lib-D4dETbbR.js';
import 'clsx';

//#region src/routes/chat/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let messages = [];
		let input = "";
		let isStreaming = false;
		let attachments = [];
		let copiedId = null;
		function getTextContent(msg) {
			if (typeof msg.content === "string") return msg.content;
			return msg.content.filter((p) => p.type === "text").map((p) => p.text ?? "").join("");
		}
		function getImages(msg) {
			if (msg.attachments && msg.attachments.length > 0) return msg.attachments.map((a) => a.dataUrl);
			if (Array.isArray(msg.content)) return msg.content.filter((p) => p.type === "image_url" && p.image_url).map((p) => p.image_url.url);
			return [];
		}
		function renderMarkdown(text) {
			text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
				return `<pre class="code-block"><code class="lang-${lang}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
			});
			text = text.replace(/`([^`]+)`/g, "<code class=\"inline-code\">$1</code>");
			text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
			text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
			text = text.replace(/^### (.+)$/gm, "<h3 class=\"chat-h3\">$1</h3>");
			text = text.replace(/^## (.+)$/gm, "<h2 class=\"chat-h2\">$1</h2>");
			text = text.replace(/^# (.+)$/gm, "<h1 class=\"chat-h1\">$1</h1>");
			text = text.replace(/^[\-\*] (.+)$/gm, "<li>$1</li>");
			text = text.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
			text = text.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
			text = text.replace(/\n\n/g, "<br/><br/>");
			text = text.replace(/\n/g, "<br/>");
			return text;
		}
		$$renderer.push(`<div class="flex flex-col gap-0 h-[calc(100dvh-theme(spacing.16)-theme(spacing.20))] lg:h-[calc(100dvh-theme(spacing.12))] -mx-4 md:-mx-8 lg:-mx-12"><div class="flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/5 shrink-0"><div class="flex items-center gap-3"><div class="p-2 bg-accent-yellow/10 rounded-xl text-accent-yellow">`);
		ChatCircleDots($$renderer, {
			size: 22,
			weight: "fill"
		});
		$$renderer.push(`<!----></div> <div><h1 class="text-lg font-bold tracking-tight">chat</h1> <p class="text-[10px] text-white/30 font-bold tracking-widest">kimi k2.6 · nvidia nim</p></div></div> <div class="flex items-center gap-2">`);
		if (messages.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button${attr("disabled", isStreaming, true)} title="retry last message" class="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all disabled:opacity-30">`);
			ArrowClockwise($$renderer, { size: 18 });
			$$renderer.push(`<!----></button> <button${attr("disabled", isStreaming, true)} title="clear chat" class="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30">`);
			Trash($$renderer, { size: 18 });
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">`);
		if (messages.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col items-center justify-center h-full gap-6 text-center"><div class="w-16 h-16 rounded-2xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow">`);
			ChatCircleDots($$renderer, {
				size: 36,
				weight: "duotone"
			});
			$$renderer.push(`<!----></div> <div><p class="text-xl font-bold text-white/80">kimi k2.6</p> <p class="text-white/30 text-sm mt-1 max-w-xs">your docker stack is already loaded as context. ask anything, or type a slash command to inject more:</p></div> <div class="grid grid-cols-2 gap-2 w-full max-w-sm"><!--[-->`);
			const each_array = ensure_array_like([
				"/compose",
				"/help",
				"/container nginx",
				"/dir /home"
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let hint = each_array[$$index];
				$$renderer.push(`<button class="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white/50 hover:text-white/80 transition-all text-left preserve-case">${escape_html(hint)}</button>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_1 = ensure_array_like(messages);
		for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
			let msg = each_array_1[$$index_2];
			if (msg.role !== "system") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(`flex gap-3 ${stringify(msg.role === "user" ? "flex-row-reverse" : "flex-row")}`)}><div${attr_class(`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black mt-1 ${stringify(msg.role === "user" ? "bg-accent-yellow text-black" : "bg-white/10 text-white/60")}`)}>${escape_html(msg.role === "user" ? "u" : "k")}</div> <div${attr_class(`flex flex-col gap-1 max-w-[85%] ${stringify(msg.role === "user" ? "items-end" : "items-start")}`)}><!--[-->`);
				const each_array_2 = ensure_array_like(getImages(msg));
				for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
					let imgSrc = each_array_2[$$index_1];
					$$renderer.push(`<img${attr("src", imgSrc)} alt="attachment" class="rounded-xl max-h-60 object-cover border border-white/10"/>`);
				}
				$$renderer.push(`<!--]--> `);
				if (getTextContent(msg) || msg.streaming) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="relative group/msg"><div${attr_class(`rounded-2xl px-4 py-3 text-sm leading-relaxed preserve-case ${stringify(msg.role === "user" ? "bg-accent-yellow/15 border border-accent-yellow/20 text-white rounded-tr-sm" : msg.error ? "bg-red-500/10 border border-red-500/20 text-red-300 rounded-tl-sm" : "bg-white/5 border border-white/5 text-white/90 rounded-tl-sm")} `)}>`);
					if (msg.role === "assistant") {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`${html(renderMarkdown(getTextContent(msg)))} `);
						if (msg.streaming) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<span class="inline-block w-2 h-4 bg-accent-yellow animate-pulse ml-0.5 align-middle rounded-sm"></span>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<span class="whitespace-pre-wrap">${escape_html(getTextContent(msg))}</span>`);
					}
					$$renderer.push(`<!--]--></div> `);
					if (!msg.streaming && getTextContent(msg)) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<button${attr_class(`absolute ${stringify(msg.role === "user" ? "left-0" : "right-0")} -bottom-5 opacity-0 group-hover/msg:opacity-100 transition-opacity text-white/30 hover:text-white/70 p-0.5`)} title="copy">`);
						if (copiedId === msg.id) {
							$$renderer.push("<!--[0-->");
							Check($$renderer, {
								size: 13,
								weight: "bold",
								class: "text-green-400"
							});
						} else {
							$$renderer.push("<!--[-1-->");
							CopySimple($$renderer, { size: 13 });
						}
						$$renderer.push(`<!--]--></button>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <span class="text-[10px] text-white/20 px-1">${escape_html(msg.timestamp.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				}))}</span></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--> <div></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (attachments.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex gap-2 px-4 md:px-8 pb-2 overflow-x-auto shrink-0"><!--[-->`);
			const each_array_3 = ensure_array_like(attachments);
			for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
				let att = each_array_3[i];
				$$renderer.push(`<div class="relative shrink-0"><img${attr("src", att.dataUrl)}${attr("alt", att.name)} class="w-16 h-16 rounded-xl object-cover border border-white/10"/> <button class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">`);
				X($$renderer, {
					size: 11,
					weight: "bold"
				});
				$$renderer.push(`<!----></button></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="px-4 md:px-8 pb-4 pt-2 border-t border-white/5 shrink-0"><div class="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-accent-yellow/30 transition-all"><button class="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-accent-yellow hover:bg-accent-yellow/10 transition-all mb-0.5" title="attach image">`);
		Image($$renderer, { size: 20 });
		$$renderer.push(`<!----></button> <input type="file" accept="image/*" multiple="" class="hidden"/> <textarea placeholder="ask anything, or /container nginx…"${attr("rows", 1)}${attr("disabled", isStreaming, true)} class="flex-1 bg-transparent border-none outline-none resize-none text-sm text-white placeholder-white/20 leading-relaxed preserve-case max-h-40 overflow-y-auto disabled:opacity-50 svelte-23dtxz" style="field-sizing: content;">`);
		const $$body = escape_html(input);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea> <button${attr("disabled", (attachments.length === 0), true)} class="shrink-0 p-2 rounded-xl bg-accent-yellow text-black disabled:opacity-30 hover:bg-accent-yellow/90 active:scale-95 transition-all mb-0.5">`);
		$$renderer.push("<!--[-1-->");
		PaperPlaneRight($$renderer, {
			size: 16,
			weight: "fill"
		});
		$$renderer.push(`<!--]--></button></div> <p class="text-[10px] text-white/15 mt-1.5 text-center">shift+enter for new line · paste or attach images · /slash commands inject context</p></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BPVI3WM6.js.map
