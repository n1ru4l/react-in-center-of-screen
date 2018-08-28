//@flow
import React, { Component, type Node } from "react";

export type OffsetYContextType = {
  offsetY?: number,
  listItemHeight: number,
  columnsPerRow: number,
  centerYStart: number,
  centerYEnd: number,
  listItemLowerBound: number,
  listItemUpperBound: number,
  initialOffset: number,
  contentOffset: number
};

const OffsetYContext = React.createContext<OffsetYContextType>({
  offsetY: undefined,
  listItemHeight: 0,
  columnsPerRow: 1,
  centerYStart: 0,
  centerYEnd: 0,
  listItemLowerBound: 0,
  listItemUpperBound: 0,
  initialOffset: 0,
  contentOffset: 0
});

export type IndexContextType = number;

const IndexContext = React.createContext<IndexContextType>(0);

type SetOffsetYFunction = (offsetY: number) => void;

export type OffsetYProviderFaCCOptions = {
  setOffsetY: (offsetY: number) => void
};

export type InvokeResultType = {
  invoke: (offsetY: number) => void,
  cancel: () => void
};

export type InvokeFunctionType = (
  invoke: SetOffsetYFunction
) => InvokeResultType;

export type OffsetYProviderProps = {
  children: (opts: OffsetYProviderFaCCOptions) => Node,
  listItemHeight: number,
  columnsPerRow: number,
  centerYStart: number,
  centerYEnd: number,
  createInvokeFunction?: InvokeFunctionType,
  listItemLowerBound?: number,
  listItemUpperBound?: number,
  initialOffset?: number,
  contentOffset?: number
};

type OffsetYProviderState = {
  offsetY?: number,
  setOffsetY: SetOffsetYFunction
};

export class OffsetYProvider extends Component<
  OffsetYProviderProps,
  OffsetYProviderState
> {
  _setOffsetY: SetOffsetYFunction;
  _invoke: InvokeResultType;
  constructor(props: any) {
    super(props);
    this._setOffsetY = (offsetY: number) => this.setState({ offsetY });

    this._invoke = {
      invoke: this._setOffsetY,
      cancel: () => undefined
    };
    let setOffsetY = this._setOffsetY;

    if (this.props.createInvokeFunction) {
      this._invoke = this.props.createInvokeFunction(setOffsetY);
    }

    this.state = {
      offsetY: undefined,
      setOffsetY: (offsetY: number) => this._invoke.invoke(offsetY)
    };
  }

  componentDidUpdate(prevProps: OffsetYProviderProps) {
    if (
      this.props.createInvokeFunction !== prevProps.createInvokeFunction &&
      this.props.createInvokeFunction
    ) {
      this._invoke = this.props.createInvokeFunction(this._setOffsetY);
    }
  }

  componentWillUnmount() {
    this._invoke.cancel();
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
        listItemUpperBound = listItemHeight / 2,
        contentOffset = 0
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
          initialOffset,
          contentOffset
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
                listItemUpperBound,
                contentOffset
              } = value;
              let isInCenter = false;

              const muliplier = Math.floor(index / columnsPerRow);
              const offsetTop = listItemHeight * muliplier + contentOffset;
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
