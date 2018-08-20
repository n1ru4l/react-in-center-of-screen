//@flow
import React from "react";
import { render } from "react-testing-library";
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

  //$FlowFixMe
  _setOffsetY = (_setOffsetY: (value: number) => void);

  getByText("ayyy");

  _setOffsetY(149);

  getByText("ayyy");
  _setOffsetY(150);

  getByText("is in center");

  _setOffsetY(250);

  getByText("is in center");

  _setOffsetY(251);

  getByText("ayyy");
  _setOffsetY(150);

  unmount();
  done();
});

test("it can handle initialOffset", async done => {
  let _setOffsetY = null;

  // we have a header with a height of 100
  const { unmount, getByText } = render(
    <OffsetYProvider
      centerYStart={100}
      centerYEnd={200}
      columnsPerRow={1}
      listItemHeight={100}
      initialOffset={150}
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

  //$FlowFixMe
  _setOffsetY = (_setOffsetY: (value: number) => void);

  getByText("is in center");

  _setOffsetY(149);

  getByText("ayyy");

  unmount();
  done();
});

test("it supports listItemLowerBound/listItemUpperBound", async done => {
  let _setOffsetY = null;

  // we have a header with a height of 100
  const { unmount, getByText } = render(
    <OffsetYProvider
      centerYStart={100}
      centerYEnd={200}
      columnsPerRow={1}
      listItemHeight={100}
      listItemLowerBound={0}
      listItemUpperBound={100}
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

  getByText("ayyy");

  //$FlowFixMe
  _setOffsetY = (_setOffsetY: (value: number) => void);

  _setOffsetY(100);
  getByText("is in center");

  _setOffsetY(300);
  getByText("is in center");
  _setOffsetY(301);
  getByText("ayyy");

  unmount();
  done();
});
