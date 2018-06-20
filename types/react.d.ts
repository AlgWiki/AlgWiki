import { ComponentType } from 'react';

declare global {
  // IP = Internal Props (eg. `class C extends Component { render() { const ip: IP = this.props; } }`)
  // EP = External Props (eg. `const ep: EP = { a: 1, b: 2 }; const c = <C {...ep} />;`)
  // DP = Default Props (eg. `class C extends Component { static defaultProps: DP = {}; }`)

  // Props that must have default values (all optional props, every optional prop required)
  export type DefaultProps<EP> = Required<
    // prettier-ignore
    // (prettier removes the `-` symbol for some reason)
    Pick<EP, { [K in keyof EP]-?: {} extends { [V in K]: EP[K] } ? K : never }[keyof EP]>
  >;

  // Type of `this.props` as it appears inside the component
  export type InternalProps<EP, DP extends DefaultProps<EP>> = EP & DP;

  // Props required to be passed (props without default values)
  export type RequiredProps<IP extends DP, DP> = Pick<IP, Exclude<keyof IP, keyof DP>>;

  // Props to be passed (props with defaults are optional, rest are mandatory)
  export type ExternalProps<IP extends DP, DP> = Required<RequiredProps<IP, DP>> & Partial<DP>;

  // Component type with appropriate external props based on default props
  export type ComponentWithDefaults<IP extends DP, DP = {}> = ComponentType<ExternalProps<IP, DP>>;
}

// // Desired (doesn't work)
// interface Props {
//   /** doc comment x */
//   x: number;
//   y: number;
// }
// export default class C extends Component<Props> {
//   static defaultProps = {
//     x: 42,
//   };
//   render() {
//     return null;
//   }
// }
// <C y={3} />; // error: x not defined

// // Workaround 1 (loses doc comments)
// interface Props {
//   /** doc comment x */
//   x: number;
//   y: number;
// }
// class C extends Component<Props> {
//   static defaultProps = { // warning: silently fails if typed as `Partial<Props>`
//     x: 42,
//   };
//   render() {
//     return null;
//   }
// }
// export type CProps = ExternalProps<Props, typeof C.defaultProps>;
// export default C as ComponentClass<CProps>;

// // Workaround 2
// interface CProps {
//   /** doc comment x */
//   x?: number; // you must manually add `?` to all props in the default props
//   y: number;
// }
// class C extends Component<InternalProps<CProps, typeof C.defaultProps>> {
//   static defaultProps = {
//     x: 42,
//   };
//   render() {
//     return null;
//   }
// }
// export default C as ComponentClass<Props>;
