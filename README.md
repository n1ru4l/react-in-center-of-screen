# @n1ru4l/react-in-center-of-screen

[![NpmVersion](https://img.shields.io/npm/v/@n1ru4l/react-in-center-of-screen.svg)](https://www.npmjs.com/package/@n1ru4l/react-in-center-of-screen)
[![npm](https://img.shields.io/npm/dt/@n1ru4l/react-in-center-of-screen.svg)](https://www.npmjs.com/package/@n1ru4l/react-in-center-of-screen)
[![CircleCI](https://circleci.com/gh/n1ru4l/react-in-center-of-screen.svg?style=shield)](https://circleci.com/gh/n1ru4l/react-in-center-of-screen)
![Dependency Status](https://david-dm.org/n1ru4l/react-in-center-of-screen/status.svg)
![Development Dependency Status](https://david-dm.org/n1ru4l/react-in-center-of-screen/dev-status.svg)
![Peer Dependency Status](https://david-dm.org/n1ru4l/react-in-center-of-screen/peer-status.svg)

Utility Components for determining whether elements are in the center of the screen.

Designed for `react-native`, but also compatible to browser environments.

**Features**

- Determine which list items are in the center of the viewport
- Multiple list items per column

**Restrictions:**

- All list items must have the same height
- Only supports vertical lists

### Install

`yarn add -E @n1ru4l/react-in-center-of-screen`

## Usage Example

```js
//@flow
import React, { Component } from "react";
import { Dimensions, FlatList, View, Text } from "react-native";
import {
  OffsetYProvider,
  IndexProvider,
  InCenterConsumer
} from "@n1ru4l/react-in-center-of-screen";

const { height: windowHeight } = Dimensions.get("window");

const boxHeight = windowHeight / 3;

type MyComponentState = {
  data: Array<string>
};

export class MyComponent extends Component<any, MyComponentState> {
  state = {
    data: ["red", "yellow", "green", "blue"]
  };
  keyExtractor = (item: string) => item;
  render() {
    const {
      keyExtractor,
      state: { data }
    } = this;
    return (
      <OffsetYProvider
        columnsPerRow={1}
        listItemHeight={boxHeight}
        centerYStart={(windowHeight * 1) / 3}
        centerYEnd={(windowHeight * 2) / 3}
      >
        {({ setOffsetY }) => (
          <FlatList
            data={data}
            onScroll={ev => {
              setOffsetY(ev.nativeEvent.contentOffset.y);
            }}
            keyExtractor={keyExtractor}
            renderItem={({ index, item }) => (
              <IndexProvider index={index}>
                {() => (
                  <View style={{ height: boxHeight, backgroundColor: item }}>
                    <InCenterConsumer>
                      {({ isInCenter }) =>
                        isInCenter ? <Text>I am in the center</Text> : null
                      }
                    </InCenterConsumer>
                  </View>
                )}
              </IndexProvider>
            )}
          />
        )}
      </OffsetYProvider>
    );
  }
}
```

## API

### `<OffsetYProvider {...OffsetYProviderProps}>{() => React.Node}</OffsetYProvider>`

#### OffsetYProviderProps

- `columnsPerRow` (number): Colums per row
- `listItemHeight` (number): Height of a single list item
- `centerYStart` (number): y coordinate of the start of the center
- `centerYEnd` (number): y coordinate of the end of the center
- `createInvokeFunction` ((invoke: () => void) => { invoke: () => void, cancel: () => void}): implement your own invoke function for throttling or debouncing
- `listItemLowerBound` (?number): lowerBound for visible area (defaults to `listItemHeight` / 2)
- `listItemUpperBound` (?number): upperBound for visible area (defaults to `listItemHeight` / 2)
- `initialOffset` (?number): initial content offset
- `contentOffset` (?number): offset of the list items (e.g. the height of a list header)

### `<IndexProvider {...IndexProviderProps}>{() => React.Node}</IndexProvider>`

#### IndexProviderProps

- `index` (number): index of the list item

### `<InCenterConsumer>{({data: InCenterConsumerData}) => React.Node}</InCenterConsumer>`

#### InCenterConsumerData

- `isInCenter` (boolean): A value that indicates whether the list item is located in the defined center
