export const debugLog = (message: string, data?: unknown) => { try { console.log('[DEBUG] ' + message, data || ''); } catch (error) { console.error('Error in debug log:', error); } };
