import { j as json } from './index-CG007fFn.js';
import yaml from 'js-yaml';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/compose/fix/+server.ts
var POST = async ({ request }) => {
	const { yaml: content, error } = await request.json();
	try {
		const parsed = yaml.load(content);
		return json({
			fixed: yaml.dump(parsed, {
				indent: 2,
				lineWidth: -1,
				noRefs: true
			}),
			message: "yaml linted and formatted"
		});
	} catch (err) {
		return json({
			error: err.message,
			message: "failed to fix yaml"
		}, { status: 400 });
	}
};

export { POST };
//# sourceMappingURL=_server.ts-BHnpvA6Y.js.map
