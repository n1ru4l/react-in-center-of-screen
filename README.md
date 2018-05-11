### @n1ru4l/react-in-center-of-screen

Utility Components for determining whether elements are in the center of the screen.

Designed for `react-native`, but also compatible to browser environments.

**Features**

* Determine which list items are in the center of the viewport
* Multiple list items per column

**Restrictions:**

* All list items must have the same height
* Only supports vertical lists

### Install

`yarn add -E @n1ru4l/react-in-center-of-screen`

## Usage Example

```js
//@flow
import React, { Component } from "react";
import { Dimensions, FlatList, View, Text } from "react-native";
import { OffsetYProvider, IndexProvider, InCenterConsumer } from "./../src";

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
        centerYStart={windowHeight * 1 / 3}
        centerYEnd={windowHeight * 2 / 3}
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
                <View style={{ height: boxHeight, backgroundColor: item }}>
                  <InCenterConsumer>
                    {({ isInCenter }) =>
                      isInCenter ? <Text>I am in the center</Text> : null
                    }
                  </InCenterConsumer>
                </View>
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
