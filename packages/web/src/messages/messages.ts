interface HasMessage {
  message(): string;
}

interface HasTitle {
  title(): string;
}

export type Messages = HasTitle & {
  loading: HasMessage;
  error: HasMessage & HasTitle;
  notFound: HasMessage & HasTitle;

  search: {
    field(): string;
    button(): string;
    results(args: { results: number; terms: string }): string;
  };

  character: {
    on(): string;
    kun(): string;
  };
};
