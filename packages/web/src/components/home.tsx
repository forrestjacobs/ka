import React, { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";

class HomePageComponent extends PureComponent {
  public render(): ReactNode {
    return <>Home</>;
  }
}

export const HomePage = connect(() => ({}))(HomePageComponent);
