import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';

let mongo;
let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('auth routes', () => {
  it('registers and logs in a citizen', async () => {
    const register = await request(app).post('/api/auth/register').send({
      name: 'Asha Citizen',
      email: 'asha@example.com',
      password: 'password123',
      role: 'citizen'
    });

    expect(register.status).toBe(201);
    expect(register.body.accessToken).toBeTruthy();

    const login = await request(app).post('/api/auth/login').send({
      email: 'asha@example.com',
      password: 'password123'
    });

    expect(login.status).toBe(200);
    expect(login.body.user.role).toBe('citizen');
  });
});
