import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { checkA11y } from '@storybook/addon-a11y';
import '@storybook/addon-console';

// addDecorator(
//   withInfo({
//     inline: true,
//     header: false,
//   }),
// );

addDecorator(checkA11y);

const req = require.context('../packages', true, /\/__stories__\/.*\bstories\.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
