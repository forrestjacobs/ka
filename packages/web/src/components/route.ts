import { match } from "react-router";
import { Dispatch } from "../actions";
import { RouteConfig } from "react-router-config";
import { Location } from "history";

export type AsyncRoute = RouteConfig & {
  loadData: (props: {
    location: Location;
    match: match<{}>;
    dispatch: Dispatch;
  }) => Promise<void>;
};

export type Route = RouteConfig | AsyncRoute;
