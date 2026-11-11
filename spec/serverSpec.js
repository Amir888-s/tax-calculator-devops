const { createServer } = require('../src/server');
describe('HTTP application', () => {
  let server, base;
  beforeAll(async () => {
    server = createServer();
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  });
  afterAll(async () => { await new Promise(resolve => server.close(resolve)); });
  it('serves the calculator', async () => { const r = await fetch(base); expect(r.status).toBe(200); expect(await r.text()).toContain('Calculate tax'); });
  it('exposes health', async () => expect(await (await fetch(base+'/health')).json()).toEqual({status:'ok'}));
  it('calculates through the API', async () => expect((await (await fetch(base+'/api/tax?income=100&rate=20')).json()).tax).toBe(20));
  it('rejects missing inputs', async () => expect((await fetch(base+'/api/tax?rate=20')).status).toBe(400));
  it('rejects blank inputs', async () => expect((await fetch(base+'/api/tax?income=&rate=20')).status).toBe(400));
  it('rejects out of range inputs', async () => expect((await fetch(base+'/api/tax?income=100&rate=101')).status).toBe(400));
  it('returns 404 for unknown routes', async () => expect((await fetch(base+'/unknown')).status).toBe(404));
  it('rejects unsupported methods', async () => expect((await fetch(base,{method:'POST'})).status).toBe(405));
});
