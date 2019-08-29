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

interface InnerErrorBoundedViewProps {
  href: string;
}

interface InnerErrorBoundedViewState {
  error?: Error;
  isNotFound: boolean;
  errorHref?: string;
}

class InnerErrorBoundedView extends React.Component<
  InnerErrorBoundedViewProps,
  InnerErrorBoundedViewState
> {
  public static getDerivedStateFromProps(
    props: InnerErrorBoundedViewProps,
    state: InnerErrorBoundedViewState
  ): Partial<InnerErrorBoundedViewState> | null {
    if (state.error && props.href !== state.errorHref) {
      return {
        error: undefined,
        isNotFound: false,
        errorHref: undefined
      };
    }
    return null;
  }

  public constructor(props: InnerErrorBoundedViewProps) {
    super(props);
    this.state = {
      isNotFound: false
    };
  }

  public componentDidCatch(error: Error): void {
    this.setState({
      error,
      isNotFound: error instanceof NotFoundError,
      errorHref: this.props.href
    });
  }

  public render(): JSX.Element {
    if (this.state.error && this.state.isNotFound) {
      return <NotFound />;
    } else if (this.state.error) {
      return <ErrorComponent />;
    } else {
      return <View />;
    }
  }
}
