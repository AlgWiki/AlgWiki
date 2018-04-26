export const testTitle = 'N-th Prime';

export const testDoc = {
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
          marks: [{ type: 'link', attrs: { href: 'https://en.wikipedia.org/wiki/Prime_number' } }],
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
};

export const testSolution = `function nthPrime(n) {
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

// export default {
//   type: 'doc',
//   version: 1,
//   content: [
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'Hello, ',
//           marks: [
//             {
//               type: 'link',
//               attrs: {
//                 href: 'https://www.atlassian.com',
//               },
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: 'World!',
//           marks: [
//             {
//               type: 'strong',
//             },
//             {
//               type: 'link',
//               attrs: {
//                 href: 'https://www.atlassian.com',
//               },
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: ' Look I can do ',
//         },
//         {
//           type: 'text',
//           text: 'italic ',
//           marks: [
//             {
//               type: 'em',
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: ', strong ',
//           marks: [
//             {
//               type: 'em',
//             },
//             {
//               type: 'strong',
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: 'and underlined text!',
//           marks: [
//             {
//               type: 'em',
//             },
//             {
//               type: 'strong',
//             },
//             {
//               type: 'underline',
//             },
//           ],
//         },
//         {
//           "type": "text",
//           "text": " and action mark",
//           "marks": [
//             {
//               "type": "action",
//               "attrs": {
//                 "key": "test-action-key",
//                 "title": "test action mark",
//                 "target": {
//                   "receiver": "some-receiver",
//                   "key": "some-key"
//                 },
//                 "parameters": {
//                   "test": 20
//                 }
//               }
//             }
//           ]
//         },
//         {
//           "type": "text",
//           "text": " and invalid action mark",
//           "marks": [
//             {
//               "type": "action",
//               "attrs": {
//                 "key": "test-action-key",
//                 "title": "test action mark",
//                 "target": {
//                   "receiver": "some-receiver"
//                 },
//                 "parameters": {
//                   "test": 30
//                 }
//               }
//             }
//           ]
//         }
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'My favourite emoji are ',
//         },
//         {
//           type: 'emoji',
//           attrs: {
//             shortName: ':grin:',
//             id: '1f601',
//             text: '😁',
//           },
//         },
//         {
//           type: 'text',
//           text: ' ',
//         },
//         {
//           type: 'emoji',
//           attrs: {
//             shortName: ':evilburns:',
//             id: 'atlassian-evilburns',
//             text: ':evilburns:',
//           },
//         },
//         {
//           type: 'text',
//           text: ' ',
//         },
//         {
//           type: 'emoji',
//           attrs: {
//             shortName: ':not-an-emoji:',
//           },
//         },
//         {
//           type: 'text',
//           text: '. What are yours?',
//           marks: [
//             {
//               type: 'unkown mark',
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'Hi, my name is... My name is... My name is... My name is ',
//         },
//         {
//           type: 'mention',
//           attrs: {
//             id: '1',
//             text: '@Oscar Wallhult',
//           },
//         },
//         {
//           type: 'text',
//           text: ' :D',
//           marks: [
//             {
//               type: 'unknown mark',
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'This is a ',
//         },
//         {
//           type: 'mention',
//           attrs: {
//             text: '@mention',
//             id: '2',
//           },
//         },
//         {
//           type: 'text',
//           text: '. And this is a broken ',
//         },
//         {
//           type: 'mention',
//           attrs: {
//             textxtx: '@mention',
//             id: 'mention',
//           },
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'Mention with restricted access',
//         },
//         {
//           type: 'mention',
//           attrs: {
//             id: '1',
//             accessLevel: 'APPLICATION',
//           },
//           text: '@oscar',
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'Mentions with generic ids',
//         },
//         {
//           type: 'mention',
//           attrs: {
//             id: 'here',
//             accessLevel: 'CONTAINER',
//           },
//           text: '@here',
//         },
//         {
//           type: 'mention',
//           attrs: {
//             id: 'all',
//             accessLevel: 'CONTAINER',
//           },
//           text: '@all',
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'This is  a   text    with\tmultiple\t\tspaces \t\t\tand\t\t\t\ttabs.',
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'italic',
//           marks: [
//             {
//               type: 'em',
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: 'link',
//           marks: [
//             {
//               type: 'link',
//               attrs: {
//                 href: 'https://www.atlassian.com',
//               },
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: 'strike-through',
//           marks: [
//             {
//               type: 'strike',
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: 'strong',
//           marks: [
//             {
//               type: 'strong',
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: 'sub',
//           marks: [
//             {
//               type: 'subsup',
//               attrs: {
//                 type: 'sub',
//               },
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: 'sup',
//           marks: [
//             {
//               type: 'subsup',
//               attrs: {
//                 type: 'sup',
//               },
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: 'underline',
//           marks: [
//             {
//               type: 'underline',
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: ' red text',
//           marks: [
//             {
//               type: 'textColor',
//               attrs: {
//                 color: '#ff0000',
//               },
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'some inline code: ',
//         },
//         {
//           type: 'text',
//           text: 'const foo = bar();',
//           marks: [
//             {
//               type: 'code',
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'unknown type',
//           attrs: {
//             text: 'fallback text in node.attrs.text',
//           },
//         },
//         {
//           type: 'hardBreak',
//         },
//         {
//           type: 'unknown type 2',
//           text: 'fallback text in node.text',
//         },
//         {
//           type: 'hardBreak',
//         },
//         {
//           type: 'very unknown',
//         },
//       ],
//     },
//     {
//       type: 'some block unknown type',
//       content: [
//         {
//           type: 'text',
//           text: 'This is text content inside unknown block',
//         },
//       ],
//     },
//     {
//       type: 'some block unknown type with content and text',
//       content: [
//         {
//           type: 'text',
//           text: 'This is also a piece of text inside unknown block',
//         },
//       ],
//       text: 'ERROR: This text should be ignored!',
//     },
//     {
//       type: 'unknown_table',
//       content: [
//         {
//           type: 'unknown_row2',
//           content: [
//             {
//               type: 'unknown_cell',
//               content: [
//                 {
//                   type: 'text',
//                   text: 'Madness?',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: 'unknown_row2',
//           content: [
//             {
//               type: 'unknown_cell3',
//               content: [
//                 {
//                   type: 'text',
//                   text: 'This is',
//                 },
//               ],
//             },
//             {
//               type: 'unknown_cell4',
//               content: [
//                 {
//                   type: 'sparta-node',
//                   attrs: {
//                     textUrl: 'https://en.wikipedia.org/wiki/Sparta',
//                   },
//                   text: 'Sparta!',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'This is a line with ',
//         },
//         {
//           type: 'hardBreak',
//         },
//         {
//           type: 'text',
//           text: 'a hardbreak in it.',
//         },
//       ],
//     },
//     {
//       type: 'heading',
//       attrs: {
//         level: 1,
//       },
//       content: [
//         {
//           type: 'text',
//           text: 'Heading 1',
//         },
//       ],
//     },
//     {
//       type: 'heading',
//       attrs: {
//         level: 2,
//       },
//       content: [
//         {
//           type: 'text',
//           text: 'Heading 2',
//           marks: [
//             {
//               type: 'link',
//               attrs: {
//                 href: 'www.atlassian.com',
//               },
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'heading',
//       attrs: {
//         level: 3,
//       },
//       content: [
//         {
//           type: 'text',
//           text: 'Heading 3',
//         },
//       ],
//     },
//     {
//       type: 'heading',
//       attrs: {
//         level: 4,
//       },
//       content: [
//         {
//           type: 'text',
//           text: 'Heading 4',
//         },
//       ],
//     },
//     {
//       type: 'heading',
//       attrs: {
//         level: 5,
//       },
//       content: [
//         {
//           type: 'text',
//           text: 'Heading 5',
//         },
//       ],
//     },
//     {
//       type: 'heading',
//       attrs: {
//         level: 6,
//       },
//       content: [
//         {
//           type: 'text',
//           text: 'Heading 6',
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'This is a paragraph with a text node',
//         },
//         {
//           type: 'text',
//           text: '\n',
//         },
//         {
//           type: 'text',
//           text: 'that contains a new line',
//         },
//       ],
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'Click me! ',
//           marks: [
//             {
//               type: 'link',
//               attrs: {
//                 href: 'javascript:alert("hello world")',
//               },
//             },
//           ],
//         },
//         {
//           type: 'text',
//           text: 'www.atlassian.com',
//           marks: [
//             {
//               type: 'link',
//               attrs: {
//                 href: 'www.atlassian.com',
//               },
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'codeBlock',
//       content: [
//         {
//           type: 'text',
//           text:
//             '// Create a map.\nfinal IntIntOpenHashMap map = new IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);',
//         },
//         {
//           type: 'text',
//           text:
//             '\nint count = map.forEach(new IntIntProcedure()\n{\n   int count;\n   public void apply(int key, int value)\n   {\n       if (value >= 5) count++;\n   }\n}).count;\nSystem.out.println("There are " + count + " values >= 5");',
//         },
//       ],
//       attrs: {
//         language: 'javascript',
//       },
//     },
//     {
//       type: 'mediaSingle',
//       attrs: {
//         layout: 'full-width',
//       },
//       content: [
//         {
//           type: 'media',
//           attrs: {
//             type: 'file',
//             id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
//             collection: 'MediaServicesSample',
//             height: 200,
//             width: 300,
//           },
//         },
//       ],
//     },
//     {
//       type: 'mediaGroup',
//       content: [
//         {
//           type: 'media',
//           attrs: {
//             type: 'file',
//             id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
//             collection: 'MediaServicesSample',
//           },
//         },
//       ],
//     },
//     {
//       type: 'mediaGroup',
//       content: [
//         {
//           type: 'media',
//           attrs: {
//             type: 'file',
//             id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
//             collection: 'MediaServicesSample',
//           },
//         },
//         {
//           type: 'media',
//           attrs: {
//             type: 'file',
//             id: '2dfcc12d-04d7-46e7-9fdf-3715ff00ba40',
//             collection: 'MediaServicesSample',
//           },
//         },
//       ],
//     },
//     {
//       type: 'mediaGroup',
//       content: [
//         {
//           type: 'media',
//           attrs: {
//             type: 'link',
//             id: '410f38f7-ce31-4527-a69d-740e958bf1d1',
//             collection: 'MediaServicesSample',
//           },
//         },
//       ],
//     },
//     {
//       type: 'mediaGroup',
//       content: [
//         {
//           type: 'media',
//           attrs: {
//             type: 'link',
//             id: '15a9fb95-2d72-4d28-b338-00fd6bea121b',
//             collection: 'MediaServicesSample',
//           },
//         },
//         {
//           type: 'media',
//           attrs: {
//             type: 'link',
//             id: '410f38f7-ce31-4527-a69d-740e958bf1d1',
//             collection: 'MediaServicesSample',
//           },
//         },
//       ],
//     },
//     {
//       type: 'bulletList',
//       content: [
//         {
//           type: 'listItem',
//           content: [
//             {
//               type: 'paragraph',
//               content: [
//                 {
//                   type: 'text',
//                   text: 'First list item',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: 'listItem',
//           content: [
//             {
//               type: 'paragraph',
//               content: [
//                 {
//                   type: 'text',
//                   text: 'Second list item',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: 'listItem',
//           content: [
//             {
//               type: 'paragraph',
//               content: [
//                 {
//                   type: 'text',
//                   text: 'Third list item',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'orderedList',
//       content: [
//         {
//           type: 'listItem',
//           content: [
//             {
//               type: 'paragraph',
//               content: [
//                 {
//                   type: 'text',
//                   text: 'First list item',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: 'listItem',
//           content: [
//             {
//               type: 'paragraph',
//               content: [
//                 {
//                   type: 'text',
//                   text: 'Second list item',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: 'listItem',
//           content: [
//             {
//               type: 'paragraph',
//               content: [
//                 {
//                   type: 'text',
//                   text: 'Third list item',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'blockquote',
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text:
//                 'All that is gold does not glitter, not all those who wander are lost; The old that is strong does not wither, deep roots are not reached by the frost.',
//             },
//           ],
//         },
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text:
//                 'From the ashes a fire shall be woken, a light from the shadows shall spring; Renewed shall be blade that was broken, the crownless again shall be king.',
//             },
//           ],
//         },
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'J.R.R. Tolkien, The Fellowship of the Ring.',
//               marks: [
//                 {
//                   type: 'em',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'panel',
//       attrs: {
//         panelType: 'info',
//       },
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'This is an info panel with ',
//             },
//             {
//               type: 'text',
//               text: 'bold text',
//               marks: [
//                 {
//                   type: 'strong',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'panel',
//       attrs: {
//         panelType: 'note',
//       },
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'This is a note panel with ',
//             },
//             {
//               type: 'text',
//               text: 'bold text',
//               marks: [
//                 {
//                   type: 'strong',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'panel',
//       attrs: {
//         panelType: 'tip',
//       },
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'This is a tip panel with ',
//             },
//             {
//               type: 'text',
//               text: 'bold text',
//               marks: [
//                 {
//                   type: 'strong',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'panel',
//       attrs: {
//         panelType: 'warning',
//       },
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'This is a warning panel with ',
//             },
//             {
//               type: 'text',
//               text: 'bold text',
//               marks: [
//                 {
//                   type: 'strong',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'rule',
//     },
//     {
//       type: 'paragraph',
//       content: [
//         {
//           type: 'text',
//           text: 'Do not use this image node; it may be removed at any time without notice.',
//         },
//         {
//           type: 'image',
//           attrs: {
//             src:
//               'https://www.google.com.au/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
//             alt: 'Google Logo',
//             title: 'Google!',
//           },
//         },
//       ],
//     },
//     {
//       type: 'applicationCard',
//       text: 'applicationCard',
//       attrs: {
//         text: 'applicationCard',
//         background: {
//           url: 'http://atlassian.com',
//         },
//         link: {
//           url: 'http://atlassian.com',
//         },
//         title: {
//           text: 'Sascha Reuter commented on a file: Desktop sidebar states.png',
//         },
//         user: {
//           icon: {
//             url:
//               'https://extranet.atlassian.com/download/attachments/2246873520/sreuter-57703-pp-1530510_4271148635152_5186589029777108540_n.jpg',
//             label: 'Sascha Reuter',
//           },
//         },
//         preview: {
//           url: 'https://image.ibb.co/ghKzoF/1a99566b0c8e0589ca327bb1efe0be5ca1419aa8.png',
//         },
//         description: {
//           title: 'Can haz description',
//           text:
//             '\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius mattis massa, quis ornare orci. Integer congue\nrutrum velit, quis euismod eros condimentum quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris\nlobortis nibh id odio egestas luctus. Nunc nulla lacus, congue eu nibh non, imperdiet varius lacus. Nulla sagittis\nmagna et tincidunt volutpat. Nunc augue lorem, eleifend et tempor ut, malesuada ac lorem. Praesent quis feugiat eros,\net vehicula nibh. Maecenas vehicula commodo nisi, at rutrum ipsum posuere sit amet. Integer sit amet nisl sed ligula\nconsectetur feugiat non at ligula. Cras dignissim suscipit magna at mattis. Maecenas ante leo, feugiat vestibulum velit\na, commodo finibus velit. Maecenas interdum ullamcorper velit non suscipit. Proin tempor, magna vitae dapibus laoreet,\nquam dui convallis lectus, in vestibulum arcu eros eu velit. Quisque vel dolor enim.\n',
//         },
//         details: [
//           {
//             icon: {
//               url:
//                 'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png',
//               label: 'Issue type',
//             },
//             text: 'Story',
//           },
//           {
//             badge: {
//               value: 101,
//               max: 99,
//               appearance: 'important',
//             },
//           },
//           {
//             lozenge: {
//               text: 'In Progress',
//               appearance: 'inprogress',
//             },
//           },
//           {
//             title: 'Watchers',
//             users: [
//               {
//                 icon: {
//                   url: 'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
//                   label: 'James Newell',
//                 },
//               },
//               {
//                 icon: {
//                   url: 'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
//                   label: 'Jon Blower',
//                 },
//               },
//               {
//                 icon: {
//                   url: 'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
//                   label: 'Scott Simpson',
//                 },
//               },
//             ],
//           },
//           {
//             icon: {
//               url:
//                 'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png',
//               label: 'Issue type',
//             },
//             text: 'Story',
//           },
//           {
//             badge: {
//               value: 101,
//               max: 99,
//               appearance: 'important',
//             },
//           },
//           {
//             lozenge: {
//               text: 'In Progress',
//               appearance: 'inprogress',
//             },
//           },
//           {
//             title: 'Watchers',
//             users: [
//               {
//                 icon: {
//                   url: 'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
//                   label: 'James Newell',
//                 },
//               },
//               {
//                 icon: {
//                   url: 'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
//                   label: 'Jon Blower',
//                 },
//               },
//               {
//                 icon: {
//                   url: 'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
//                   label: 'Scott Simpson',
//                 },
//               },
//             ],
//           },
//           {
//             icon: {
//               url:
//                 'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png',
//               label: 'Issue type',
//             },
//             text: 'Story',
//           },
//           {
//             badge: {
//               value: 101,
//               max: 99,
//               appearance: 'important',
//             },
//           },
//           {
//             lozenge: {
//               text: 'In Progress',
//               appearance: 'inprogress',
//             },
//           },
//           {
//             title: 'Watchers',
//             users: [
//               {
//                 icon: {
//                   url: 'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
//                   label: 'James Newell',
//                 },
//               },
//               {
//                 icon: {
//                   url: 'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
//                   label: 'Jon Blower',
//                 },
//               },
//               {
//                 icon: {
//                   url: 'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
//                   label: 'Scott Simpson',
//                 },
//               },
//             ],
//           },
//         ],
//         context: {
//           text: 'Design Home / ... / Media Cards Design',
//           icon: {
//             url: 'https://image.ibb.co/jSrC8F/f4b5e33d6b1d36556114a18b594768f41f32673e.png',
//             label: 'foobar',
//           },
//           link: {
//             url: 'https://confluence.atlassian.com/',
//           },
//         },
//       },
//     },
//     {
//       type: 'decisionList',
//       attrs: {
//         localId: 'empty-list-should-not-render',
//       },
//       content: [
//         {
//           type: 'decisionItem',
//           attrs: {
//             localId: 'to-be-ignored-as-no-content',
//             state: 'DECIDED',
//           },
//         },
//       ],
//     },
//     {
//       type: 'taskList',
//       attrs: {
//         localId: 'empty-list-should-not-render',
//       },
//       content: [
//         {
//           type: 'taskItem',
//           attrs: {
//             localId: 'to-be-ignored-as-no-content',
//             state: 'TODO',
//           },
//         },
//       ],
//     },
//     {
//       type: 'decisionList',
//       attrs: {
//         localId: '',
//       },
//       content: [
//         {
//           type: 'decisionItem',
//           attrs: {
//             localId: '',
//             state: 'DECIDED',
//           },
//           content: [
//             {
//               type: 'text',
//               text: 'Hello world',
//             },
//             {
//               type: 'hardBreak',
//             },
//             {
//               type: 'text',
//               text: 'This is a decision ',
//             },
//             {
//               type: 'emoji',
//               attrs: {
//                 shortName: ':wink:',
//                 id: '1f609',
//                 text: '😉',
//               },
//             },
//             {
//               type: 'text',
//               text: ' ',
//             },
//             {
//               type: 'mention',
//               attrs: {
//                 id: '0',
//                 text: '@Carolyn',
//                 accessLevel: 'CONTAINER',
//               },
//             },
//             {
//               type: 'text',
//               text: ' ',
//             },
//             {
//               type: 'text',
//               text: 'was',
//               marks: [
//                 {
//                   type: 'strong',
//                 },
//               ],
//             },
//             {
//               type: 'text',
//               text: ' ',
//             },
//             {
//               type: 'text',
//               text: 'here',
//               marks: [
//                 {
//                   type: 'em',
//                 },
//                 {
//                   type: 'underline',
//                 },
//               ],
//             },
//             {
//               type: 'text',
//               text: '.',
//             },
//             {
//               type: 'mention',
//               attrs: {
//                 id: 'error:NotFound',
//                 text: '@NoLongerWorksHere',
//                 accessLevel: 'CONTAINER',
//               },
//             },
//             {
//               type: 'text',
//               text: ' ',
//             },
//             {
//               type: 'text',
//               text: 'is not',
//               marks: [
//                 {
//                   type: 'strong',
//                 },
//               ],
//             },
//             {
//               type: 'text',
//               text: ' ',
//             },
//             {
//               type: 'text',
//               text: 'here.',
//             },
//           ],
//         },
//         {
//           type: 'decisionItem',
//           attrs: {
//             localId: '',
//             state: 'DECIDED',
//           },
//           content: [
//             {
//               type: 'text',
//               text: 'decision 2',
//             },
//           ],
//         },
//         {
//           type: 'decisionItem',
//           attrs: {
//             localId: 'to-be-ignored-as-no-content',
//             state: 'DECIDED',
//           },
//         },
//       ],
//     },
//     {
//       type: 'taskList',
//       attrs: {
//         localId: '',
//       },
//       content: [
//         {
//           type: 'taskItem',
//           attrs: {
//             localId: 'task-1',
//             state: 'TODO',
//           },
//           content: [
//             {
//               type: 'text',
//               text: 'Could you please',
//             },
//             {
//               type: 'hardBreak',
//             },
//             {
//               type: 'text',
//               text: 'do this ',
//             },
//             {
//               type: 'mention',
//               attrs: {
//                 id: '0',
//                 text: '@Carolyn',
//                 accessLevel: 'CONTAINER',
//               },
//             },
//             {
//               type: 'text',
//               text: ' ',
//             },
//             {
//               type: 'emoji',
//               attrs: {
//                 shortName: ':wink:',
//                 id: '1f609',
//                 text: '😉',
//               },
//             },
//           ],
//         },
//         {
//           type: 'taskItem',
//           attrs: {
//             localId: 'task-2',
//             state: 'DONE',
//           },
//           content: [
//             {
//               type: 'text',
//               text: 'This is completed',
//             },
//           ],
//         },
//         {
//           type: 'taskItem',
//           attrs: {
//             localId: 'to-be-ignored-as-no-content',
//             state: 'TODO',
//           },
//         },
//       ],
//     },
//     {
//       type: 'table',
//       content: [
//         {
//           type: 'tableRow',
//           content: [
//             {
//               type: 'tableHeader',
//               attrs: {
//                 colspan: 2,
//                 colwidth: [233, 100],
//               },
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [],
//                 },
//               ],
//             },
//             {
//               type: 'tableHeader',
//               attrs: {
//                 background: '#DEEBFF',
//               },
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: 'tableRow',
//           content: [
//             {
//               type: 'tableCell',
//               attrs: {
//                 colspan: 1,
//                 rowspan: 1,
//                 background: null,
//               },
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [],
//                 },
//               ],
//             },
//             {
//               type: 'tableCell',
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [],
//                 },
//               ],
//             },
//             {
//               type: 'tableCell',
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           type: 'tableRow',
//           content: [
//             {
//               type: 'tableCell',
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [],
//                 },
//               ],
//             },
//             {
//               type: 'tableCell',
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [],
//                 },
//               ],
//             },
//             {
//               type: 'tableCell',
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       type: 'bodiedExtension',
//       attrs: {
//         extensionType: 'com.atlassian.fabric',
//         extensionKey: 'clock',
//         bodyType: 'rich',
//       },
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'This is the default content of the extension',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
