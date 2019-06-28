import { mount } from '@vue/test-utils';

import LogoutButton from './LogoutButton.vue';

describe('LogoutButton', () => {
  const mockAuth = {
    logout: jest.fn(() => {
      return { catch: jest.fn() };
    })
  };

  it('Logs user out when clicked', () => {
    const wrapper = mount(LogoutButton, { mocks: { $auth: mockAuth } });

    const button = wrapper.find('button');

    expect(button.text()).toEqual('Log Out');

    button.trigger('click');

    expect(mockAuth.logout).toHaveBeenCalled();
  });
});
