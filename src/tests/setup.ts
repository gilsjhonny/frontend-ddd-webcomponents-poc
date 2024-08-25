import '@testing-library/jest-dom/vitest';
import createFetchMock from 'vitest-fetch-mock';
import { beforeAll, vi } from 'vitest';

const fetchMocker = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
