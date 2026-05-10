import { docker } from '$lib/server/docker';

export const GET = () => {
    const stream = new ReadableStream({
        async start(controller) {
            const dockerStream = await docker.getEvents();
            let buffer = '';
            
            dockerStream.on('data', (chunk: Buffer) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const event = JSON.parse(line);
                        const data = JSON.stringify({
                            type: event.Type,
                            action: event.Action,
                            actor: event.Actor?.Attributes?.name || event.Actor?.ID || 'unknown',
                            time: event.time
                        });
                        controller.enqueue(`data: ${data}\n\n`);
                    } catch (e) {
                        console.error('failed to parse docker event:', line);
                    }
                }
            });

            dockerStream.on('error', (err: Error) => {
                controller.error(err);
            });

            dockerStream.on('end', () => {
                controller.close();
            });
        },
        cancel() {
            // How to stop the docker stream?
            // Usually dockerStream.destroy() or similar
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};
