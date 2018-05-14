//@flow
import React from "react";
import { render } from "react-testing-library";
import lolex from "lolex";
import { IndexProvider, OffsetYProvider, InCenterConsumer } from "../src";

test("exports the right components", done => {
  expect(IndexProvider).toBeDefined();
  expect(OffsetYProvider).toBeDefined();
  expect(InCenterConsumer).toBeDefined();
  done();
});

test("it can render the components", async done => {
  let _setOffsetY = null;
  const { unmount, getByText } = render(
    <OffsetYProvider
      centerYStart={100}
      centerYEnd={200}
      columnsPerRow={1}
      listItemHeight={100}
    >
      {({ setOffsetY }) => {
        _setOffsetY = setOffsetY;
        return (
          <IndexProvider index={3}>
            {() => (
              <InCenterConsumer>
                {({ isInCenter }) =>
                  isInCenter ? <div>is in center</div> : <div>ayyy</div>
                }
              </InCenterConsumer>
            )}
          </IndexProvider>
        );
      }}
    </OffsetYProvider>
  );

  expect(() => {
    getByText("is in center");
  }).toThrowError();

  if (!_setOffsetY) {
    //eslint-disable-next-line no-unused-vars
    _setOffsetY = (num: number) => undefined;
  }

  _setOffsetY(149);

  expect(() => {
    getByText("is in center");
  }).toThrowError();
  _setOffsetY(150);

  getByText("is in center");

  _setOffsetY(250);

  getByText("is in center");

  _setOffsetY(251);

  expect(() => {
    getByText("is in center");
  }).toThrowError();
  _setOffsetY(150);

  unmount();
  done();
});

test("it can use the debounce", async done => {
  const clock = lolex.install();

  let _setOffsetY = null;
  const { unmount, getByText } = render(
    <OffsetYProvider
      centerYStart={100}
      centerYEnd={200}
      columnsPerRow={1}
      listItemHeight={100}
      debounce={200}
    >
      {({ setOffsetY }) => {
        _setOffsetY = setOffsetY;
        return (
          <IndexProvider index={3}>
            {() => (
              <InCenterConsumer>
                {({ isInCenter }) =>
                  isInCenter ? <div>is in center</div> : <div>ayyy</div>
                }
              </InCenterConsumer>
            )}
          </IndexProvider>
        );
      }}
    </OffsetYProvider>
  );

  if (!_setOffsetY) {
    //eslint-disable-next-line no-unused-vars
    _setOffsetY = (num: number) => undefined;
  }

  _setOffsetY(150);

  expect(() => {
    getByText("is in center");
  }).toThrowError();

  clock.tick(200);

  getByText("is in center");

  unmount();
  done();
});
