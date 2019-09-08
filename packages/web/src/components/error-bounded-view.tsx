import { NotFoundError } from "navi";
import React from "react";
import { useCurrentRoute, View } from "react-navi";
import { ErrorComponent } from "./error/component";
import { NotFound } from "./not-found/component";

// Based on https://github.com/frontarm/navi/blob/master/packages/react-navi/src/NotFoundBoundary.tsx

export function ErrorBoundedView(): JSX.Element {
  const { url } = useCurrentRoute();
  return <InnerErrorBoundedView href={url.href} />;
}

enum ErrorType {
  None,
  NotFound,
  GenericError
}

const viewByErrorType = {
  [ErrorType.None]: View,
  [ErrorType.NotFound]: NotFound,
  [ErrorType.GenericError]: ErrorComponent
};

interface InnerErrorBoundedViewProps {
  href: string;
}

interface InnerErrorBoundedViewState {
  type: ErrorType;
  lastErrorHref?: string;
}

class InnerErrorBoundedView extends React.Component<
  InnerErrorBoundedViewProps,
  InnerErrorBoundedViewState
> {
  public static getDerivedStateFromProps(
    props: InnerErrorBoundedViewProps,
    state: InnerErrorBoundedViewState
  ): Partial<InnerErrorBoundedViewState> | null {
    if (state.type !== ErrorType.None && props.href !== state.lastErrorHref) {
      return {
        type: ErrorType.None,
        lastErrorHref: undefined
      };
    }
    return null;
  }

  public constructor(props: InnerErrorBoundedViewProps) {
    super(props);
    this.state = {
      type: ErrorType.None
    };
  }

  public componentDidCatch(error: Error): void {
    this.setState({
      type:
        error instanceof NotFoundError ? ErrorType.NotFound : ErrorType.None,
      lastErrorHref: this.props.href
    });
  }

  public render(): JSX.Element {
    const V = viewByErrorType[ErrorType.None];
    return <V />;
  }
}
