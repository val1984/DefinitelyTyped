// Type definitions for @krakenjs/zoid 10.1.0
// Project: http://krakenjs.com, https://github.com/krakenjs/zoid
// Definitions by: Valentin Descamps <https://github.com/val1984>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 4.1

type XPropDefinitionType<PropType> = PropType extends string
    ? 'string'
    : PropType extends boolean
    ? 'boolean'
    : PropType extends number
    ? 'number'
    : PropType extends unknown[]
    ? 'array'
    : PropType extends (...args: unknown[]) => unknown
    ? 'function'
    : 'object';

export type XPropsDefinition<Props> = {
    [Key in keyof Props]-?: {
        type: XPropDefinitionType<Props[Key]>;
        required: Props[Key] extends Required<unknown> ? true : false;
    };
};

export enum EVENT {
    RENDER,
    RENDERED,
    PRERENDER,
    PRERENDERED,
    DISPLAY,
    ERROR,
    CLOSED,
    PROPS,
    RESIZE,
}

interface BaseParentXProps {
    onClose(): void;
}

type Dimension = `${number}${'%' | 'px'}`;

type ZoidRenderingContext = 'popup' | 'iframe';

export interface ComponentOptions<Props> {
    tag: string;
    url: string | (() => string);
    dimensions?: {
        width?: number | Dimension;
        height?: number | Dimension;
    };
    defaultContext: ZoidRenderingContext;
    props: XPropsDefinition<Props>;
}

interface CreateProps extends Partial<BaseParentXProps> {
    name: string;
}

export interface ZoidComponentInstance<Props> {
    /**
     * Render the component to a given container
     * @param container can be a string selector like `'#my-container'` or a DOM element like `document.body`
     * @param context defaults to `iframe` or `defaultContainer` if set. Can be overriden to explicitly specify `'iframe'` or `'popup'`
     */
    render(container?: string | HTMLElement, context?: ZoidRenderingContext): Promise<void>;
    /**
     * Render the component to a given window and given container
     * @param window a reference to the window which the component should be rendered to. Zoid must be loaded in that window and the component must be registered.
     * @param container must be a string selector like `'#my-container'` (DOM element is not transferable across different windows)
     * @param context defaults to `iframe` or `defaultContainer` if set. Can be overriden to explicitly specify `'iframe'` or `'popup'`.
     */
    renderTo(window: Window, container: string, context?: ZoidRenderingContext): Promise<void>;
    /** Clones the current instance with the exact same set of props */
    clone(): ZoidComponentInstance<Props>;
    /** Informs if the component is eligible. Requires defining an `eligible` handler to be defined with {@link create} */
    isEligible(): boolean;
    /** Gracefully close the component */
    close(): Promise<void>;
    /** Focus the component. Only works for popup windows, on a user action like a click. */
    focus(): Promise<void>;
    /** Resize the component. Only works for iframe windows, popups can not be resized once opened. */
    resize(dimensions: { width: number; height: number }): Promise<void>;
    /** Show the component. Only works for iframe windows, popups can not be hidden/shown once opened. */
    show(): Promise<void>;
    /** Hide the component. Only works for iframe windows, popups can not be hidden/shown once opened. */
    hide(): Promise<void>;
    /**
     * Update props in the child window. The child can listen for new props using window.xprops.onProps
     * @param props Props
     */
    updateProps(props: Props): Promise<void>;
    /**
     * Trigger an error in the component
     * @param error The Error that will be triggered in the Zoid component
     */
    onError(error: Error): Promise<void>;
    event: { on(event: EVENT, handler: () => void): void };
}

export type ZoidComponent<Props> = (props: CreateProps & Props) => ZoidComponentInstance<Props>;

declare function create<Props>(options: ComponentOptions<Props>): ZoidComponent<Props>;
