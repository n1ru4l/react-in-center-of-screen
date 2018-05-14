declare module "lodash.debounce" {
  declare type DebounceOptions = {
    leading?: boolean,
    maxWait?: number,
    trailing?: boolean
  };

  declare function debounce(
    func: Function,
    wait?: number,
    options?: DebounceOptions
  ): Function;

  declare export default debounce;
}
