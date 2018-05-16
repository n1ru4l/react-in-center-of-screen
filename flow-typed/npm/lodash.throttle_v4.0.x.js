declare module "lodash.debounce" {
  declare type ThrottleOptions = {
    leading?: boolean,
    trailing?: boolean
  };

  declare function throttle(
    func: Function,
    wait?: number,
    options?: ThrottleOptions
  ): Function;

  declare export default throttle;
}
