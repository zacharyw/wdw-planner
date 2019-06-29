import { mount } from '@vue/test-utils';

import flushPromises from 'flush-promises';
import FastPasses from './FastPasses.vue';

describe('FastPasses', () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = mount(FastPasses, {
      stubs: {
        transition: false
      }
    });
  });

  it('Renders fastpass title', () => {
    expect(wrapper.find('.title').text()).toEqual('FastPass');
  });

  it('Renders park selection', () => {
    const parkSelector = wrapper.find({ ref: 'park-selector' });

    expect(parkSelector.findAll('option').length).toEqual(5);

    expect(parkSelector.find('[value="Magic Kingdom"]').exists()).toBe(true);
    expect(parkSelector.find('[value="Animal Kingdom"]').exists()).toBe(true);
    expect(parkSelector.find('[value="Epcot"]').exists()).toBe(true);
    expect(parkSelector.find('[value="Hollywood Studios"]').exists()).toBe(
      true
    );
  });

  describe('When park is selected', () => {
    beforeEach(async () => {
      wrapper
        .find({ ref: 'park-selector' })
        .find('[value="Magic Kingdom"]')
        .setSelected();

      await flushPromises();
    });

    it('Creates three empty fastpass selectors', () => {
      const fastPassSelectors = wrapper.findAll({ ref: 'fast-pass-selector' });

      expect(fastPassSelectors.length).toEqual(3);
      [0, 1, 2].forEach(index => {
        expect(wrapper.vm.fastPasses[index].attraction).toEqual(null);
        expect(wrapper.vm.fastPasses[index].time).toEqual(null);
      });
      expect(wrapper.findAll('[value="Space Mountain"]').length).toEqual(3);
    });

    describe('When first fastpass is selected', () => {
      beforeEach(async () => {
        wrapper
          .findAll({ ref: 'fast-pass-selector' })
          .at(0)
          .find('[value="Space Mountain"]')
          .setSelected();

        await flushPromises();
      });

      it('Removes option from other selects', () => {
        expect(wrapper.findAll('[value="Space Mountain"]').length).toEqual(1);
      });

      it('Sets fastpass data', () => {
        expect(wrapper.vm.fastPasses[0].attraction).toEqual('Space Mountain');
        expect(wrapper.vm.fastPasses[0].time).toEqual(null);
      });
    });
  });
});
