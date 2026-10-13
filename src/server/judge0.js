const MAX_SOURCE_LENGTH = 40_000;
const MAX_OUTPUT_LENGTH = 16_000;

const RUNTIMES = [
  ['python', 'Python', /^Python \(3/i],
  ['java', 'Java', /^Java \(/i],
  ['c', 'C', /^C \(GCC/i],
  ['cpp', 'C++', /^C\+\+ \(GCC/i],
  ['csharp', 'C#', /^C# \(Mono/i],
  ['go', 'Go', /^Go \(/i],
  ['rust', 'Rust', /^Rust \(/i],
  ['ruby', 'Ruby', /^Ruby \(/i],
  ['php', 'PHP', /^PHP \(/i],
  ['kotlin', 'Kotlin', /^Kotlin \(/i],
  ['swift', 'Swift', /^Swift \(/i],
  ['typescript', 'TypeScript', /^TypeScript \(/i],
  ['r', 'R', /^R \(/i],
  ['lua', 'Lua', /^Lua \(/i],
  ['perl', 'Perl', /^Perl \(/i],
  ['haskell', 'Haskell', /^Haskell \(/i],
  ['scala', 'Scala', /^Scala \(/i],
  ['bash', 'Bash', /^Bash \(/i],
  ['pascal', 'Pascal', /^Pascal \(/i],
  ['fortran', 'Fortran', /^Fortran \(/i],
  ['cobol', 'COBOL', /^COBOL \(/i],
  ['dart', 'Dart', /^Dart \(/i],
  ['elixir', 'Elixir', /^Elixir \(/i],
  ['erlang', 'Erlang', /^Erlang \(/i],
  ['clojure', 'Clojure', /^Clojure \(/i],
  ['fsharp', 'F#', /^F# \(/i],
  ['prolog', 'Prolog', /^Prolog \(/i],
  ['ada', 'Ada', /^Ada \(/i],
  ['objective-c', 'Objective-C', /^Objective-C \(/i],
  ['sql', 'SQL (SQLite)', /^SQLite \(/i],
];

export class RunnerConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RunnerConfigurationError';
  }
}

export function getRunnerUrl() {
  const configuredUrl = process.env.JUDGE0_URL;
  if (!configuredUrl) {
    throw new RunnerConfigurationError('The private code runner is not configured.');
  }

  let url;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new RunnerConfigurationError('JUDGE0_URL must be a valid HTTP(S) URL.');
  }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new RunnerConfigurationError('JUDGE0_URL must be an HTTP(S) URL without embedded credentials.');
  }
  return url.toString().replace(/\/$/, '');
}

export async function fetchRunner(path, options = {}, timeoutMs = 8_000) {
  const runnerUrl = getRunnerUrl();
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (process.env.JUDGE0_AUTH_TOKEN) {
    headers.set('X-Auth-Token', process.env.JUDGE0_AUTH_TOKEN);
  }

  const response = await fetch(`${runnerUrl}${path}`, {
    ...options,
    headers,
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    throw new Error(`The private runner returned HTTP ${response.status}.`);
  }
  return response;
}

export async function getRuntimeLanguages() {
  const response = await fetchRunner('/languages');
  const available = await response.json();
  if (!Array.isArray(available)) {
    throw new Error('The private runner returned an invalid language list.');
  }

  return RUNTIMES.flatMap(([id, name, pattern]) => {
    const runtime = available.find((candidate) => pattern.test(candidate.name || ''));
    return runtime ? [{ id, name, languageId: runtime.id }] : [];
  });
}

export function readCodeRequest(req) {
  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_SOURCE_LENGTH + 2_048) {
    throw Object.assign(new Error('Code must be 40 KB or smaller.'), { statusCode: 413 });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      throw Object.assign(new Error('The request body must contain valid JSON.'), { statusCode: 400 });
    }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw Object.assign(new Error('A JSON request body is required.'), { statusCode: 400 });
  }
  if (typeof body.code !== 'string' || !body.code.trim()) {
    throw Object.assign(new Error('Add code before running it.'), { statusCode: 400 });
  }
  if (Buffer.byteLength(body.code, 'utf8') > MAX_SOURCE_LENGTH) {
    throw Object.assign(new Error('Code must be 40 KB or smaller.'), { statusCode: 413 });
  }
  if (typeof body.language !== 'string' || !/^[a-z][a-z0-9-]{0,23}$/.test(body.language)) {
    throw Object.assign(new Error('Choose a supported programming language.'), { statusCode: 400 });
  }
  return { code: body.code, language: body.language };
}

export async function executeCode(language, code) {
  const deadline = Date.now() + 25_000;
  const runtimes = await getRuntimeLanguages();
  const runtime = runtimes.find((candidate) => candidate.id === language);
  if (!runtime) {
    throw Object.assign(new Error('That language is not available on the configured private runner.'), { statusCode: 422 });
  }
  const submissionTimeout = Math.min(15_000, deadline - Date.now());
  if (submissionTimeout <= 0) {
    throw new Error('The private runner did not have time to accept this execution.');
  }

  let response = await fetchRunner(
    '/submissions?base64_encoded=true&wait=true',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: runtime.languageId,
        source_code: Buffer.from(code, 'utf8').toString('base64'),
      }),
    },
    submissionTimeout,
  );
  let result = await response.json();
  if (!result || typeof result !== 'object') {
    throw new Error('The private runner returned an invalid execution result.');
  }
  if (typeof result.token === 'string' && result.status?.id <= 2) {
    do {
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      await new Promise((resolve) => setTimeout(resolve, Math.min(300, remaining)));
      const pollTimeout = Math.min(5_000, deadline - Date.now());
      if (pollTimeout <= 0) break;
      response = await fetchRunner(`/submissions/${encodeURIComponent(result.token)}?base64_encoded=true`, {}, pollTimeout);
      result = await response.json();
    } while (result?.status?.id <= 2 && Date.now() < deadline);
  }
  if (!result.status || result.status.id <= 2) {
    throw new Error('The private runner did not finish execution before the time limit.');
  }

  const decode = (value) => {
    if (typeof value !== 'string') return '';
    try {
      return Buffer.from(value, 'base64').toString('utf8').slice(0, MAX_OUTPUT_LENGTH);
    } catch {
      return '';
    }
  };
  const status = String(result.status.description || 'Execution finished').slice(0, 100);
  const stdout = decode(result.stdout);
  const stderr = [decode(result.stderr), decode(result.compile_output), decode(result.message)]
    .filter(Boolean)
    .join('\n')
    .slice(0, MAX_OUTPUT_LENGTH);

  return {
    status,
    stdout,
    stderr,
    time: typeof result.time === 'string' ? result.time.slice(0, 32) : null,
    memory: Number.isFinite(result.memory) ? result.memory : null,
    accepted: result.status.id === 3,
  };
}

export function sendJson(res, statusCode, body, headers = {}) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  res.status(statusCode).json(body);
}
