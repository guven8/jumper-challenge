import request from 'supertest';
import { app } from '@/server';
import { verifyMessage } from 'ethers';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('ethers', () => ({
  verifyMessage: vi.fn(),
}));

describe('Authentication API - /api/auth', () => {
  const validAddress = '0xe547AC2846ACe88fc1C6B9205f84cfdc87F10E46';
  const validSignature =
    '0x64380eb8921924dbc83bf05473c7dc883d548614de341473cec0f5c026cdbd4174ef09a6349b4232e8100e035ab7b66872959e649b5aa6a5520126731e91a5071b';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should authenticate a user with a valid signature', async () => {
    (verifyMessage as vi.Mock).mockReturnValue(validAddress);

    const res = await request(app)
      .post('/api/auth')
      .send({ address: validAddress, signature: validSignature })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should reject a request with an invalid signature', async () => {
    (verifyMessage as vi.Mock).mockReturnValue('0xInvalidAddress');

    const res = await request(app)
      .post('/api/auth')
      .send({ address: validAddress, signature: 'invalid_signature' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid signature');
  });

  it('should return 400 for missing request body', async () => {
    const res = await request(app).post('/api/auth').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
