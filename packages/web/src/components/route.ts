import { Location } from "history";
import { match } from "react-router";
import { RouteConfig } from "react-router-config";
import { Dispatch } from "../actions";

export type AsyncRoute = RouteConfig & {
  loadData: (props: {
    location: Location;
    match: match<{}>;
    dispatch: Dispatch;
  }) => Promise<void>;
};

export type Route = RouteConfig | AsyncRoute;
