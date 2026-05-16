import { json } from '@sveltejs/kit';
import { getContainerStatsHistory, getContainerStatsAggregated } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
  const { id } = params;
  const hours = parseInt(url.searchParams.get('hours') || '24');
  const aggregation = url.searchParams.get('aggregate') || 'none'; // none, hourly, daily
  
  try {
    let data;
    if (aggregation === 'none') {
      data = getContainerStatsHistory(id, hours);
    } else {
      data = getContainerStatsAggregated(id, hours, aggregation as 'hourly' | 'daily');
    }
    
    return json({ 
      success: true, 
      data,
      meta: {
        containerId: id,
        hours,
        aggregation,
        dataPoints: Array.isArray(data) ? data.length : 0
      }
    });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};