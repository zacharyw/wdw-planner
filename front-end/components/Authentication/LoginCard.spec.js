import { mount } from '@vue/test-utils';

import flushPromises from 'flush-promises';
import LoginCard from './LoginCard.vue';

describe('LoginCard', () => {
  let strategy = '';
  let data = '';
  let error = false;

  const errorMessage = 'Login action failed.';
  const email = 'test@example.com';
  const password = 'password';

  let wrapper = null;

  const mockAuth = {
    loginWith: (_strategy, _data) => {
      return new Promise((resolve, reject) => {
        strategy = _strategy;
        data = _data;
        if (error) {
          reject(new Error(errorMessage));
        } else {
          resolve();
        }
      });
    }
  };

  beforeEach(() => {
    wrapper = mount(LoginCard, {
      mocks: { $auth: mockAuth }
    });
  });

  describe('When login action is successful', () => {
    beforeAll(() => {
      error = false;
    });

    it('Logs in user via form', async done => {
      const wrapper = mount(LoginCard, {
        mocks: { $auth: mockAuth }
      });

      const inputs = wrapper.findAll({ name: 'BInput' });

      expect(inputs.length).toEqual(2);

      wrapper.find('input[type="email"]').setValue(email);
      wrapper.find('input[type="password"]').setValue(password);

      wrapper.vm.$nextTick(done);

      wrapper.find('form').trigger('submit.prevent');

      await flushPromises();

      expect(strategy).toBe('local');
      expect(data).toEqual({
        data: { user: { email: email, password: password } }
      });
    });
  });

  describe('When login action results in error', () => {
    beforeAll(() => {
      error = true;
    });

    it('Renders error message', async () => {
      wrapper.find('form').trigger('submit.prevent');

      await flushPromises();

      expect(wrapper.text()).toContain(errorMessage);
    });
  });
});
