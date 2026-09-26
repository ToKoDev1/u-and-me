---
name: write-tests
description: Generates comprehensive test suites with proper structure, edge cases, mocking boundaries, and framework-appropriate patterns. Use when the user asks to write, add, or generate tests for a module, function, or component.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# Write Tests

Given a module, function, or component, produce a thorough test suite that tests behavior (not implementation), covers edge cases, and follows the project's existing testing conventions.

## Step 1 — Detect the Testing Environment

Before writing any test, discover what the project already uses.

1. **Find test config**: Glob for `jest.config.*`, `vitest.config.*`, `playwright.config.*`, `.mocharc.*`, `pytest.ini`, `pyproject.toml`, `setup.cfg`, `conftest.py`.
2. **Find existing tests**: Glob for `**/*.test.*`, `**/*.spec.*`, `**/__tests__/**`, `**/test_*.py`, `**/tests/**`. Read 2-3 existing test files to learn the project's patterns — import style, assertion style, describe/it structure, setup/teardown patterns.
3. **Check test scripts**: Read `package.json` scripts for `test`, `test:unit`, `test:e2e`, `test:integration`.
4. **Check for testing utilities**: Grep for `renderWithProviders`, `createTestClient`, `testFactory`, `TestWrapper` — projects often have test helpers you should reuse.

Match everything you write to the conventions you find. If tests use `describe`/`it`, use that. If they use `test()`, use that. Match import paths, file locations, and naming.

## Step 2 — Analyze the Target Code

Read the file to be tested. Identify:

- **Exported functions/classes/components** — each is a test subject
- **Input types and parameters** — what arguments does each function take? What are the valid ranges?
- **Return types and side effects** — what does it return? Does it mutate state, write to disk, call an API?
- **Branches and conditionals** — every `if`, `switch`, ternary, and `||`/`&&` short-circuit is a path to test
- **Error handling** — every `throw`, rejected promise, or error callback is an error path to test
- **Dependencies** — what does it import? These are your mocking boundaries

## Step 3 — Determine What to Test

**Test the contract, not the implementation.** Ask: "If someone refactored the internals but kept the same behavior, would these tests still pass?" If no, the test is too coupled.

**What to always test**:
- Happy path with typical inputs
- Edge cases: empty string, empty array, zero, negative numbers, undefined/null where the type allows it
- Boundary values: first element, last element, exactly at a limit, one above, one below
- Error paths: invalid inputs, missing required fields, network failures, permission errors
- Async behavior: successful resolution, rejection, timeout

**What NOT to test**:
- Private/internal functions — test them through the public interface
- Implementation details: "it calls helper function X" — test what it returns or does, not how
- Third-party library behavior — do not test that `lodash.get` works
- Simple pass-through getters with no logic

**Coverage targets by code type**:
- Pure business logic / utility functions: aim for 100% branch coverage
- API route handlers: test each status code path (200, 400, 401, 403, 404, 500)
- React components: test user-visible behavior (renders content, handles clicks, shows errors), not internal state
- Database queries: test with actual DB or well-structured fixtures, not by mocking the ORM

## Step 4 — Structure the Tests (Arrange-Act-Assert)

Every test follows three phases:

```
// Arrange — set up inputs, mocks, state
// Act — call the function / trigger the action (exactly ONE action)
// Assert — verify the outcome
```

**Structural rules**:
- One behavior per test. If you write "and" in the test name, split it into two tests.
- Test names describe the behavior: `it('returns empty array when input is empty')`, not `it('test1')` or `it('works')`.
- Group related tests in `describe` blocks by function or behavior category.
- Use `beforeEach` for shared setup only when ALL tests in the block need it. Otherwise, set up in each test.
- Never share mutable state between tests. Each test must be independent and runnable in isolation.

## Step 5 — Mock at Boundaries Only

Mocks should only appear at architectural boundaries — where your code meets an external system.

**Mock these**:
- HTTP calls (API clients, fetch)
- Database connections (when not using a test DB)
- File system operations
- Third-party services (payment APIs, email, auth providers)
- Time (`Date.now`, timers) when testing time-dependent logic
- Random values when testing logic that depends on randomness

**Do NOT mock these**:
- Internal modules in the same package — use the real implementation
- Pure utility functions — they are fast and deterministic
- Data transformations — let them run

**Mock patterns by framework**:
- Jest: `jest.fn()`, `jest.spyOn()`, `jest.mock('module')`. Reset with `jest.clearAllMocks()` in `beforeEach`.
- Vitest: Same API as Jest. `vi.fn()`, `vi.spyOn()`, `vi.mock()`.
- Python: `unittest.mock.patch`, `@patch('module.Class.method')`, `MagicMock`.

When mocking, assert on mock calls: `expect(mockFn).toHaveBeenCalledWith(expectedArgs)`. This verifies the contract with the dependency.

## Step 6 — Handle Async Testing

- Always `await` async operations or return the promise. Unhandled promise rejections cause flaky or false-passing tests.
- For testing rejected promises: `await expect(fn()).rejects.toThrow('message')`.
- For event-based code: use `waitFor`, `findBy` (React Testing Library), or explicit promise resolution.
- For timers: use fake timers (`jest.useFakeTimers()`) and advance them explicitly.
- For testing React hooks: use `renderHook` from `@testing-library/react`.

## Step 7 — Write the Test File

1. Place the test file according to project convention (co-located `*.test.ts` or in `__tests__/` directory).
2. Write tests in this order: happy path first, then edge cases, then error paths.
3. Include a comment at the top if the test file needs special setup (test DB, env vars).

## Step 8 — Run and Verify

1. Run the test file: `npx jest path/to/file.test.ts` or `npx vitest run path/to/file.test.ts` or the project's test command.
2. All tests must pass. Fix any failures — do not leave skipped or failing tests.
3. If the project has a coverage command, run it and report the delta.
4. If a test is legitimately flaky (timing-dependent), fix the flakiness — do not add retries as a bandaid.

## Anti-Patterns to Avoid

- **Snapshot overuse**: Snapshots are brittle and provide low signal. Use them only for stable serialized output, never for component trees.
- **Testing implementation details**: `expect(setState).toHaveBeenCalledWith(...)` — this breaks on any refactor.
- **Test interdependence**: Test B relies on state from Test A. Tests must run in any order.
- **Assertion-free tests**: A test that runs code but asserts nothing. Always assert.
- **Overly precise assertions**: `expect(result).toEqual(exactLargeObject)` when you only care about two fields. Use `toMatchObject` or assert specific properties.
- **Copy-paste test blocks**: If tests are repetitive, use `test.each` / `@pytest.mark.parametrize` with a data table.

## Anpassung für U & Me

- Testrunner ist **vitest** (`npm test`), Tests liegen neben dem Code (`src/lib/*.test.ts`). Stil der bestehenden Tests (`alter.test.ts`, `kalender.test.ts`) übernehmen.
- Datumsberechnungen (Alter, U-Zeiträume, Wochen) mit festen Daten testen, nicht mit „heute“ – Grenzfälle wie Monatsenden, Schaltjahre und den Tag der Geburt selbst bedenken.
