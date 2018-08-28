//@flow
import React, { Fragment } from "react";
import { render } from "react-testing-library";
import debounce from "lodash.debounce";
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

test("it supports the contentOffset option", async done => {
  let _setOffsetY = null;

  // we have a header with a height of 100
  const { unmount, getByText } = render(
    <OffsetYProvider
      centerYStart={100}
      centerYEnd={200}
      columnsPerRow={1}
      listItemHeight={100}
      contentOffset={100}
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

  _setOffsetY(100);
  getByText("ayyy");
  _setOffsetY(200);

  unmount();
  done();
});

test("it can handle createInvokeFunction", async done => {
  const clock = lolex.install();
  let _setOffsetY = null;

  const createInvokeFunction = setOffsetY => {
    const invoke = debounce(setOffsetY, 200);
    return {
      invoke,
      cancel: invoke.cancel
    };
  };

  const { unmount, getByText } = render(
    <OffsetYProvider
      centerYStart={100}
      centerYEnd={200}
      columnsPerRow={1}
      listItemHeight={100}
      createInvokeFunction={createInvokeFunction}
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

  _setOffsetY(150);
  getByText("ayyy");

  clock.tick(200);
  getByText("is in center");

  unmount();
  clock.uninstall();
  done();
});

test("it can handle createInvokeFunction cleanup", async done => {
  const clock = lolex.install();
  let _setOffsetY = null;

  const createInvokeFunction = setOffsetY => {
    const invoke = debounce(setOffsetY, 200);
    return {
      invoke,
      cancel: invoke.cancel
    };
  };

  const { unmount, getByText } = render(
    <OffsetYProvider
      centerYStart={100}
      centerYEnd={200}
      columnsPerRow={1}
      listItemHeight={100}
      createInvokeFunction={createInvokeFunction}
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

  // eslint-disable-next-line no-console
  const consoleError = console.error;
  /* eslint-disable no-console */
  // $FlowFixMe
  console.error = done.fail;
  /* eslint-enable no-console */

  _setOffsetY(150);
  getByText("ayyy");

  // unmount before update debounce is invoked
  unmount();
  clock.tick(200);

  clock.uninstall();
  /* eslint-disable no-console */
  // $FlowFixMe
  console.error = consoleError;
  /* eslint-enable no-console */
  done();
});

test("it can handle multiple list items", async done => {
  let _setOffsetY = null;

  // we have a header with a height of 100
  const { unmount, getByText } = render(
    <OffsetYProvider
      centerYStart={5}
      centerYEnd={10}
      columnsPerRow={2}
      listItemHeight={5}
      contentOffset={0}
    >
      {({ setOffsetY }) => {
        _setOffsetY = setOffsetY;
        return (
          <Fragment>
            <IndexProvider index={0}>
              {() => (
                <InCenterConsumer>
                  {({ isInCenter }) =>
                    isInCenter ? <div>is in center 0</div> : <div>ayyy 0</div>
                  }
                </InCenterConsumer>
              )}
            </IndexProvider>
            <IndexProvider index={1}>
              {() => (
                <InCenterConsumer>
                  {({ isInCenter }) =>
                    isInCenter ? <div>is in center 1</div> : <div>ayyy 1</div>
                  }
                </InCenterConsumer>
              )}
            </IndexProvider>
            <IndexProvider index={2}>
              {() => (
                <InCenterConsumer>
                  {({ isInCenter }) =>
                    isInCenter ? <div>is in center 2</div> : <div>ayyy 2</div>
                  }
                </InCenterConsumer>
              )}
            </IndexProvider>
            <IndexProvider index={3}>
              {() => (
                <InCenterConsumer>
                  {({ isInCenter }) =>
                    isInCenter ? <div>is in center 3</div> : <div>ayyy 3</div>
                  }
                </InCenterConsumer>
              )}
            </IndexProvider>
            <IndexProvider index={4}>
              {() => (
                <InCenterConsumer>
                  {({ isInCenter }) =>
                    isInCenter ? <div>is in center 4</div> : <div>ayyy 4</div>
                  }
                </InCenterConsumer>
              )}
            </IndexProvider>
          </Fragment>
        );
      }}
    </OffsetYProvider>
  );

  //$FlowFixMe
  _setOffsetY = (_setOffsetY: (value: number) => void);

  getByText("ayyy 0");
  getByText("ayyy 1");
  getByText("is in center 2");
  getByText("is in center 3");
  getByText("ayyy 4");

  _setOffsetY(5);

  getByText("ayyy 0");
  getByText("ayyy 1");
  getByText("ayyy 2");
  getByText("ayyy 3");
  getByText("is in center 4");

  unmount();
  done();
});
