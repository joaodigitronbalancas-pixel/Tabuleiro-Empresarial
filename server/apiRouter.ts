import { Router, Request, Response } from 'express';
import { dataStore } from './store';

export const apiRouter = Router();

// ================= HEALTH & META =================
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'CompanyOS IT NOC & Datacenter Command Center Backend',
    mode: 'it_monitoring',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '4.2.0-it-ops'
  });
});

apiRouter.get('/state', (req: Request, res: Response) => {
  res.json(dataStore.getState());
});

apiRouter.post('/state/reset', (req: Request, res: Response) => {
  const reset = dataStore.resetState();
  res.json({ success: true, message: 'Database reset to initial IT state', state: reset });
});

// ================= REAL-TIME EVENTS SSE STREAM =================
apiRouter.get('/events/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial connection event
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to CompanyOS IT Realtime Event Stream', timestamp: new Date().toISOString() })}\n\n`);

  const unsubscribe = dataStore.addSSEClient((dataString: string) => {
    res.write(`data: ${dataString}\n\n`);
  });

  const heartbeatTimer = setInterval(() => {
    res.write(`: heartbeat ${Date.now()}\n\n`);
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeatTimer);
    unsubscribe();
  });
});

// ================= SERVERS & IT NODES =================
apiRouter.get('/servers', (req: Request, res: Response) => {
  res.json(dataStore.getServers());
});

apiRouter.patch('/servers/:id', (req: Request, res: Response) => {
  const updated = dataStore.updateServer(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Server not found' });
    return;
  }
  res.json(updated);
});

// ================= INCIDENTS =================
apiRouter.get('/incidents', (req: Request, res: Response) => {
  res.json(dataStore.getIncidents());
});

apiRouter.post('/incidents/:id/resolve', (req: Request, res: Response) => {
  const resolved = dataStore.resolveIncident(req.params.id);
  if (!resolved) {
    res.status(404).json({ error: 'Incident not found' });
    return;
  }
  res.json({ success: true, incident: resolved });
});
