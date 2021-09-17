import Store from "electron-store";

export interface ApplicationConfig {
  foo: string;
}

const store = new Store<ApplicationConfig>({
  defaults: {
    foo: "asdf",
  },
});

export default store;
