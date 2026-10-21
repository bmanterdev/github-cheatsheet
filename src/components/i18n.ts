/**
 * Shared helpers for the cheat-sheet components.
 * Every user-visible label can be overridden via props; these are only defaults.
 */
export type Lang = 'en' | 'ja';

export const LABELS = {
	en: {
		startOver: 'Start over',
		back: 'Back',
		yourPath: 'Your choices',
		learnMore: 'Learn more',
		copy: 'Copy',
		copied: 'Copied!',
		options: 'Options',
		showColumns: 'Columns',
		category: 'Category',
		allCategories: 'All categories',
		filter: 'Filter',
		filterPlaceholder: 'Type to filter…',
		noRows: 'No matching rows.',
		feature: 'Feature',
		yes: 'Yes',
		no: 'No',
		prev: 'Previous',
		next: 'Next',
		shuffle: 'Shuffle',
		flip: 'Flip card',
		question: 'Question',
		answer: 'Answer',
		flipHint: 'Click or press Enter to flip',
		docs: 'GitHub Docs',
		lastVerified: 'Last verified',
		tldr: 'TL;DR',
	},
	ja: {
		startOver: '最初から',
		back: '戻る',
		yourPath: '選択した内容',
		learnMore: '詳しく見る',
		copy: 'コピー',
		copied: 'コピーしました',
		options: 'オプション',
		showColumns: '表示する列',
		category: 'カテゴリ',
		allCategories: 'すべてのカテゴリ',
		filter: '絞り込み',
		filterPlaceholder: '入力して絞り込み…',
		noRows: '該当する行がありません。',
		feature: '機能',
		yes: 'あり',
		no: 'なし',
		prev: '前へ',
		next: '次へ',
		shuffle: 'シャッフル',
		flip: 'カードをめくる',
		question: '質問',
		answer: '答え',
		flipHint: 'クリックまたは Enter でめくる',
		docs: 'GitHub ドキュメント',
		lastVerified: '最終確認',
		tldr: 'TL;DR',
	},
} as const;

export type LabelKey = keyof (typeof LABELS)['en'];

/** Resolve language: explicit prop wins, otherwise the current Starlight locale, otherwise English. */
export function resolveLang(prop: string | undefined, currentLocale: string | undefined): Lang {
	const value = prop ?? currentLocale ?? 'en';
	return value.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

export function labelsFor(lang: Lang, overrides: Partial<Record<LabelKey, string>> = {}) {
	return { ...LABELS[lang], ...overrides };
}

/**
 * Minimal inline Markdown → HTML for strings passed through props.
 * Supports **bold**, *italic*, `code`, [text](url) and line breaks. Raw HTML is passed through
 * as-is (content is authored by us, not user input).
 */
export function inlineMd(input: string | undefined | null): string {
	if (!input) return '';
	const codeSpans: string[] = [];
	let out = String(input).replace(/`([^`]+)`/g, (_, code: string) => {
		codeSpans.push(code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
		return `\u0000${codeSpans.length - 1}\u0000`;
	});
	out = out
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
		.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text: string, href: string) => {
			const external = /^https?:\/\//.test(href);
			return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
		})
		.replace(/\n{2,}/g, '<br /><br />')
		.replace(/\n/g, '<br />');
	return out.replace(/\u0000(\d+)\u0000/g, (_, i: string) => `<code>${codeSpans[Number(i)]}</code>`);
}

export function isExternal(href: string) {
	return /^https?:\/\//.test(href);
}
