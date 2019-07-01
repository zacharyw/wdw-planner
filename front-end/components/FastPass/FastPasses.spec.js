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

    it('Creates three empty fastpass selectors with same options', () => {
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

      describe('When park is changed', () => {
        let confirmParkChange = null;

        beforeEach(async () => {
          // Mock confirmation pop up and automatically accept
          window.confirm = jest.fn(() => confirmParkChange);

          wrapper
            .find({ ref: 'park-selector' })
            .find('[value="Animal Kingdom"]')
            .setSelected();

          await flushPromises();
        });

        describe('When change is cancelled', () => {
          beforeAll(() => {
            confirmParkChange = false;
          });

          it('Asks for confirmation then keeps fastpasses and park', () => {
            expect(window.confirm).toHaveBeenCalled();
            expect(wrapper.vm.fastPasses[0].attraction).toEqual(
              'Space Mountain'
            );
            expect(wrapper.vm.park).toEqual('Magic Kingdom');
          });
        });

        describe('When change is confirmed', () => {
          beforeAll(() => {
            confirmParkChange = true;
          });

          it('Asks for confirmation then clears fastpasses', () => {
            expect(window.confirm).toHaveBeenCalled();
            expect(wrapper.vm.park).toEqual('Animal Kingdom');
            [0, 1, 2].forEach(index => {
              expect(wrapper.vm.fastPasses[index].attraction).toEqual(null);
              expect(wrapper.vm.fastPasses[index].time).toEqual(null);
            });
          });
        });
      });
    });
  });

  describe('When park with tier system is selected', () => {
    beforeEach(async () => {
      wrapper
        .find({ ref: 'park-selector' })
        .find('[value="Epcot"]')
        .setSelected();

      await flushPromises();
    });

    it('Displays tier message', () => {
      expect(wrapper.text()).toContain('Epcot uses a tiered FastPass system.');
    });

    describe('When one tier 1 fast pass selected', () => {
      const tierWarning = 'More than one Tier 1 FastPass';
      beforeEach(async () => {
        wrapper
          .findAll({ ref: 'fast-pass-selector' })
          .at(0)
          .find('[value="Frozen Ever After"]')
          .setSelected();

        await flushPromises();
      });

      it('Does not show warning about multiple tier ones', () => {
        expect(wrapper.text()).not.toContain(tierWarning);
      });

      describe('When a second tier 1 fast pass is selected', () => {
        beforeEach(async () => {
          wrapper
            .findAll({ ref: 'fast-pass-selector' })
            .at(1)
            .find('[value="Soarin"]')
            .setSelected();

          await flushPromises();
        });

        it('Shows warning about multiple tier ones', () => {
          expect(wrapper.text()).toContain(tierWarning);
        });

        describe('When second tier is then changed to non tier 1', () => {
          beforeEach(async () => {
            wrapper
              .findAll({ ref: 'fast-pass-selector' })
              .at(1)
              .find('[value="Spaceship Earth"]')
              .setSelected();

            await flushPromises();
          });

          it('Does not show warning about multiple tier ones', () => {
            expect(wrapper.text()).not.toContain(tierWarning);
          });
        });
      });
    });
  });
});
