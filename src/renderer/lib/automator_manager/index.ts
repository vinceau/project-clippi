// For some reason the order of these exports actually matter.
// It seems as though the `ComboEvent` export does not properly get exported
// when `./types` is exported after `./eventManager`. This causes the tests in
// the `combo.config.spec.ts` file to fail.

export * from "./eventManager";
export * from "./types";
