import { Challenge, Task, TestCase, ValueType, Method, Solution } from '../model';
import { MOCK_USERS } from './user';
import generateUuid from 'uuid/v4';

export const mockMethods: Method[] = [
  {
    id: generateUuid(),
    name: 'nthPrime',
    description: null,
    parameters: [
      {
        name: 'n',
        description: null,
        type: { type: ValueType.Integer, constraints: ['0 < n'] },
      },
    ],
  },
];
export const mockTestCases: TestCase[] = [
  {
    id: generateUuid(),
    name: null,
    isHidden: false,
    isActive: true,
    calls: [
      {
        id: generateUuid(),
        methodId: mockMethods[0].id,
        input: [{ type: ValueType.Integer, value: '123' }],
        expectedOutput: { type: ValueType.Integer, value: '54321' },
      },
    ],
  },
  {
    id: generateUuid(),
    name: null,
    isHidden: false,
    isActive: true,
    calls: [
      {
        id: generateUuid(),
        methodId: mockMethods[0].id,
        input: [{ type: ValueType.Integer, value: '7' }],
        expectedOutput: { type: ValueType.Integer, value: '11' },
      },
    ],
  },
];
export const mockTask: Task = {
  name: 'Nth Prime',
  description: {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'A ' },
          {
            type: 'text',
            text: 'prime number',
            marks: [
              { type: 'link', attrs: { href: 'https://en.wikipedia.org/wiki/Prime_number' } },
            ],
          },
          {
            type: 'text',
            text:
              ' is any whole number which is greater than 1 and is only divisible by 1 and itself.',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Given a whole number ' },
          { type: 'text', text: 'n', marks: [{ type: 'code' }] },
          { type: 'text', text: ' which is greater than 0, return the ' },
          { type: 'text', text: 'n', marks: [{ type: 'code' }] },
          { type: 'text', text: 'th', marks: [{ type: 'subsup', attrs: { type: 'sup' } }] },
          { type: 'text', text: ' prime.' },
        ],
      },
    ],
  },
  methods: mockMethods,
  testCases: mockTestCases,
};

const sampleUsers = [...MOCK_USERS];
export const mockSolutions: Solution[] = [];
for (let i = 0; i < MOCK_USERS.length; i++) {
  mockSolutions.push({
    user: sampleUsers.splice(Math.random() * sampleUsers.length, 1)[0],
    code: 'const sample = n => n+3; /' + '/'.repeat(Math.random() * 500),
  });
}

export const mockChallenge: Challenge = {
  task: mockTask,
  startDate: 0,
  endDate: 0,
  solutions: mockSolutions,
  comments: [],
};

export const mockSolution = `function nthPrime(n) {
	var currentNum = 1;
	var primesFound = 0;
	while (primesFound < n) {
		currentNum++;
		if (isPrime(currentNum)) {
			primesFound++;
		}
	}
	return currentNum;
}

function isPrime(p) {
	for (var d = 2; d < p; d++) {
		if (p % d === 0) return false;
	}
	return true;
}`;
