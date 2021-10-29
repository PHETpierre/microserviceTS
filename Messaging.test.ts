import { expect } from '@jest/globals';
import work from './Messaging';

// test('Get api count equals 1106', async () => {
//   const S = await getPosts();
//   console.log(S);
//
//   expect(1106).toStrictEqual(1106);
// });

test('ServiceRabbitMq return message', async () => {
  expect(work()).toStrictEqual('toto');
});
