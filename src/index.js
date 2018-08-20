//@flow
import React, { Component, type Node } from "react";
import createContext, { type Context } from "create-react-context";
import throttle from "lodash.throttle";

const OffsetYContext: Context<{
  offsetY?: number,
  listItemHeight: number,
  columnsPerRow: number,
  centerYStart: number,
  centerYEnd: number,
  listItemLowerBound: number,
  listItemUpperBound: number,
  initialOffset: number
}> = createContext({
  offsetY: undefined,
  listItemHeight: 0,
  columnsPerRow: 1,
  centerYStart: 0,
  centerYEnd: 0,
  listItemLowerBound: 0,
  listItemUpperBound: 0,
  initialOffset: 0
});

const IndexContext: Context<number> = createContext(0);

export type OffsetYProviderFaCCOptions = {
  setOffsetY: (offsetY: number) => void
};

export type OffsetYProviderProps = {
  children: (opts: OffsetYProviderFaCCOptions) => Node,
  listItemHeight: number,
  columnsPerRow: number,
  centerYStart: number,
  centerYEnd: number,
  throttle?: number,
  listItemLowerBound?: number,
  listItemUpperBound?: number,
  initialOffset?: number
};

type SetOffsetYFunction = (offsetY: number) => void;

type OffsetYProviderState = {
  offsetY?: number,
  setOffsetY: SetOffsetYFunction
};

export class OffsetYProvider extends Component<
  OffsetYProviderProps,
  OffsetYProviderState
> {
  constructor(props: any) {
    super(props);
    let setOffsetY = offsetY => this.setState({ offsetY });
    if (this.props.throttle) {
      setOffsetY = (throttle(
        setOffsetY,
        this.props.throttle
      ): SetOffsetYFunction);
    }
    this.state = {
      offsetY: undefined,
      setOffsetY
    };
  }

  render() {
    const {
      state: { offsetY, setOffsetY },
      props: {
        children,
        listItemHeight,
        columnsPerRow,
        centerYStart,
        centerYEnd,
        initialOffset = 0,
        listItemLowerBound = listItemHeight / 2,
        listItemUpperBound = listItemHeight / 2
      }
    } = this;
    return (
      <OffsetYContext.Provider
        value={{
          offsetY,
          listItemHeight,
          columnsPerRow,
          centerYStart,
          centerYEnd,
          listItemLowerBound,
          listItemUpperBound,
          initialOffset
        }}
      >
        {children({ setOffsetY })}
      </OffsetYContext.Provider>
    );
  }
}

export type IndexProviderProps = {
  index: number,
  children: () => Node
};

export class IndexProvider extends Component<IndexProviderProps> {
  render() {
    const {
      props: { children, index }
    } = this;
    return (
      <IndexContext.Provider value={index}>{children()}</IndexContext.Provider>
    );
  }
}

export type ConsumerProps = {
  children: (opts: { isInCenter: boolean }) => Node
};

export class InCenterConsumer extends Component<ConsumerProps> {
  render() {
    const {
      props: { children }
    } = this;

    return (
      <OffsetYContext.Consumer>
        {value => (
          <IndexContext.Consumer>
            {index => {
              let {
                initialOffset,
                offsetY = initialOffset,
                listItemHeight,
                columnsPerRow = 1,
                centerYStart,
                centerYEnd,
                listItemLowerBound,
                listItemUpperBound
              } = value;

              let isInCenter = false;
              const muliplier = Math.floor(index / columnsPerRow);
              const offsetTop = listItemHeight * muliplier;
              const positionRelativeToViewport = offsetTop - offsetY;

              const itemLowerY =
                positionRelativeToViewport + listItemLowerBound;

              const itemUpperY =
                positionRelativeToViewport + listItemUpperBound;

              if (
                (itemLowerY >= centerYStart || itemUpperY >= centerYStart) &&
                (itemLowerY <= centerYEnd || itemUpperY <= centerYEnd)
              ) {
                isInCenter = true;
              }
              return children({ isInCenter });
            }}
          </IndexContext.Consumer>
        )}
      </OffsetYContext.Consumer>
    );
  }
}
