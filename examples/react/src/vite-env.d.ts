/// <reference types="vite/client" />

// Extend JSX.IntrinsicElements to include the blocks-graph custom element
declare namespace JSX {
  interface IntrinsicElements {
    'blocks-graph': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      ref?: React.Ref<HTMLElement>
      language?: string
      'show-prerequisites'?: string
      'show-parents'?: string
      style?: React.CSSProperties
    }
  }
}
